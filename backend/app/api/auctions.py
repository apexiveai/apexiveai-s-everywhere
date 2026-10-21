from datetime import datetime, timezone
from decimal import Decimal
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import case, func
from sqlalchemy.orm import Session

from app.api.deps import CurrentUser
from app.database import get_db
from app.models import Auction, AuctionBid, User
from app.schemas.auctions import AuctionBidCreate, AuctionCreate

router = APIRouter(prefix="/auctions", tags=["Auctions"])


def require_tenant_account(user: CurrentUser) -> None:
    if user.role != "TENANT_ADMIN" or user.tenant_id is None:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            "A SuperAdmin-created tenant account is required.",
        )


def utc_isoformat(value: datetime) -> str:
    return value.replace(tzinfo=timezone.utc).isoformat()


def auction_response(
    auction: Auction,
    seller_name: str,
    current_bid: Decimal,
    bid_count: int,
) -> dict[str, object]:
    return {
        "id": auction.id,
        "title": auction.title,
        "description": auction.description,
        "seller_name": seller_name,
        "starting_price": str(auction.starting_price),
        "current_bid": str(current_bid),
        "currency": auction.currency,
        "bid_count": bid_count,
        "ended": auction.ends_at <= datetime.utcnow(),
        "ends_at": utc_isoformat(auction.ends_at),
        "created_at": utc_isoformat(auction.created_at),
    }


@router.get("")
def list_auctions(
    db: Annotated[Session, Depends(get_db)],
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
):
    now = datetime.utcnow()
    total = db.query(func.count(Auction.id)).scalar() or 0
    rows = (
        db.query(
            Auction,
            User.username,
            func.coalesce(
                func.max(AuctionBid.amount), Auction.starting_price
            ).label("current_bid"),
            func.count(AuctionBid.id).label("bid_count"),
        )
        .join(User, User.id == Auction.seller_id)
        .outerjoin(AuctionBid, AuctionBid.auction_id == Auction.id)
        .group_by(Auction.id, Auction.starting_price, User.username)
        .order_by(
            case((Auction.ends_at > now, 0), else_=1),
            Auction.ends_at.asc(),
            Auction.id.desc(),
        )
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return {
        "items": [
            auction_response(auction, seller_name, current_bid, bid_count)
            for auction, seller_name, current_bid, bid_count in rows
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size,
    }


@router.post("", status_code=status.HTTP_201_CREATED)
def create_auction(
    payload: AuctionCreate,
    user: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
):
    require_tenant_account(user)
    if payload.ends_at <= datetime.utcnow():
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "Auction end time must be in the future.",
        )

    auction = Auction(
        seller_id=user.id,
        title=payload.title,
        description=payload.description,
        starting_price=payload.starting_price,
        currency=payload.currency,
        ends_at=payload.ends_at,
    )
    db.add(auction)
    db.commit()
    db.refresh(auction)
    return auction_response(
        auction,
        user.username,
        auction.starting_price,
        0,
    )


@router.post("/{auction_id}/bids", status_code=status.HTTP_201_CREATED)
def place_bid(
    auction_id: int,
    payload: AuctionBidCreate,
    user: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
):
    require_tenant_account(user)
    auction = (
        db.query(Auction)
        .filter(Auction.id == auction_id)
        .with_for_update()
        .first()
    )
    if not auction:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Auction not found.")
    if auction.ends_at <= datetime.utcnow():
        raise HTTPException(status.HTTP_409_CONFLICT, "This auction has ended.")
    if auction.seller_id == user.id:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            "You cannot bid on your own auction.",
        )

    highest_bid = (
        db.query(AuctionBid)
        .filter(AuctionBid.auction_id == auction.id)
        .order_by(AuctionBid.amount.desc(), AuctionBid.created_at.asc())
        .first()
    )
    minimum_bid = highest_bid.amount if highest_bid else auction.starting_price
    if payload.amount <= minimum_bid:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            f"Your bid must be higher than {minimum_bid} {auction.currency}.",
        )

    bid = AuctionBid(
        auction_id=auction.id,
        bidder_id=user.id,
        amount=payload.amount,
    )
    db.add(bid)
    db.commit()
    db.refresh(bid)
    return {
        "id": bid.id,
        "auction_id": bid.auction_id,
        "amount": str(bid.amount),
        "currency": auction.currency,
        "created_at": utc_isoformat(bid.created_at),
    }
