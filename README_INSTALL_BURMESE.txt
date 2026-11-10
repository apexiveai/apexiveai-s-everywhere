DAIICHI CAMPAIGN CMS - BACKEND PATCH
===================================

ဒီ Patch က ရှိပြီးသား Daiichi Lead API / Analytics ကို မဖျက်ပါ။
Migration 006 မှာ Campaign နှင့် Campaign Audit tables အသစ် ၂ ခု ထပ်တိုးပါမယ်။

1) Copy files
- backend/app/models/daiichi_campaign.py
- backend/app/schemas/daiichi_campaigns.py
- backend/app/api/daiichi_campaigns.py
- backend/migrations/006_create_daiichi_campaigns.sql

2) backend/app/models/__init__.py ကို ဖွင့်ပြီး import များနားတွင် ထည့်ပါ။
   from app.models.daiichi_campaign import DaiichiCampaign, DaiichiCampaignAudit

   __all__ list ထဲတွင် ထည့်ပါ။
   "DaiichiCampaign",
   "DaiichiCampaignAudit",

3) backend/app/main.py ကို ဖွင့်ပြီး imports တွင် ထည့်ပါ။
   from app.api.daiichi_campaigns import public_router as daiichi_campaigns_router
   from app.api.daiichi_campaigns import admin_router as admin_daiichi_campaigns_router

   Existing app.include_router(...) များအောက်တွင် ထည့်ပါ။
   app.include_router(daiichi_campaigns_router, prefix="/api")
   app.include_router(admin_daiichi_campaigns_router, prefix="/api")

4) Migration run
   Backend project root မှ မိမိ၏ Python 3.12 venv ကို activate လုပ်ပြီး:
   python -m app.migrate

   Migration 006 ကို database schema_migrations ထဲ မှတ်တမ်းတင်ပြီး
   daiichi_campaigns နှင့် daiichi_campaign_audits tables ဖန်တီးရပါမယ်။

5) API routes
PUBLIC:
GET /api/daiichi/campaigns

SUPER ADMIN:
GET    /api/admin/daiichi/campaigns
POST   /api/admin/daiichi/campaigns
GET    /api/admin/daiichi/campaigns/{id}
PATCH  /api/admin/daiichi/campaigns/{id}
PATCH  /api/admin/daiichi/campaigns/{id}/approval
PATCH  /api/admin/daiichi/campaigns/{id}/status
GET    /api/admin/daiichi/campaigns/{id}/audit

6) Publish safety
- New campaign defaults: DRAFT + PENDING.
- PUBLISHED / SCHEDULED status requires approval_status=APPROVED.
- Public API only returns approved campaigns whose date window is active.
- This API does not claim Daiichi's official endorsement. Partner approval must be obtained outside the software and recorded by an authorized administrator.

IMPORTANT PRODUCTION NOTES
- Current auth uses existing SuperAdmin dependency. Test with a real Super Admin token.
- Configure reverse-proxy/WAF rate limits for public endpoints.
- Image URL field is provided, but upload/storage provider integration is not included yet.
- Before public launch, use a persistent object storage/CDN for images, verify privacy/consent text with legal counsel, and test DB backups/restore.
- Migration runner in this project is simple SQL splitting; this migration intentionally uses straightforward SQL statements.
