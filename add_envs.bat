@echo off
echo Removing old var...
call npx vercel env rm DATABASE_URL production -y >nul 2>&1
call npx vercel env rm DIRECT_URL production -y >nul 2>&1
call npx vercel env rm JWT_SECRET production -y >nul 2>&1
call npx vercel env rm CLOUDINARY_CLOUD_NAME production -y >nul 2>&1
call npx vercel env rm CLOUDINARY_API_KEY production -y >nul 2>&1
call npx vercel env rm CLOUDINARY_API_SECRET production -y >nul 2>&1
call npx vercel env rm NEXT_PUBLIC_SITE_URL production -y >nul 2>&1

echo Adding new var...
type tmp_db.txt | call npx vercel env add DATABASE_URL production
type tmp_direct.txt | call npx vercel env add DIRECT_URL production
type tmp_jwt.txt | call npx vercel env add JWT_SECRET production
type tmp_c_name.txt | call npx vercel env add CLOUDINARY_CLOUD_NAME production
type tmp_c_key.txt | call npx vercel env add CLOUDINARY_API_KEY production
type tmp_c_secret.txt | call npx vercel env add CLOUDINARY_API_SECRET production

echo https://yourportfolio.com > tmp_url.txt
type tmp_url.txt | call npx vercel env add NEXT_PUBLIC_SITE_URL production

echo Done!
