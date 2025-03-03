# from fastapi_amis_admin.admin.settings import Settings
# from fastapi_amis_admin.admin.site import AdminSite
# from fastapi_amis_admin.admin import admin

# from models.user_model import User

# # Tạo AdminSite instance
# site = AdminSite(settings=Settings(database_url_async='postgresql+asyncpg://app_user:app_password@postgresql/mcpe_platform')) # type: ignore

# @site.register_admin
# class UserAdmin(admin.ModelAdmin):
#     page_schema = 'User'
#     model = User