import bcrypt
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, Security
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import time
import jwt
from jwt import PyJWKClient
from datetime import datetime, timezone
from fastapi import Request, HTTPException, Depends
from jose import jwt
from jwt import PyJWKClient, ExpiredSignatureError, InvalidTokenError
from datetime import datetime, timezone
    
def verify_token(token: str):
    ISSUER = "https://login.puzzle.sg"
    try:
        # Lấy public key từ Okta
        jwks_url = f"{ISSUER}/oauth2/v1/keys"
        jwks_client = PyJWKClient(jwks_url)
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        # Giải mã và xác minh token
        decoded = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            audience=ISSUER,
            issuer=ISSUER,
        )

        # Kiểm tra thời gian hết hạn của token
        exp_timestamp = decoded.get("exp")
        if exp_timestamp:
            exp_datetime = datetime.fromtimestamp(exp_timestamp, timezone.utc)
            now = datetime.now(timezone.utc)
            if exp_datetime < now:
                raise HTTPException(status_code=401, detail="Token has expired")

        return decoded

    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Authentication error: {str(e)}")

def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    
    token = auth_header.split(" ")[1]
    return verify_token(token)
