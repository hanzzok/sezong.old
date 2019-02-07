@echo off
if exist dist (
  echo Stage 0: Remove dist folder
  rmdir /S /Q dist & echo Stage: Remove Complete
)
echo Stage 1: Compile
npm run build & echo Stage 1: Compile Complete & (
  echo Stage 2: Copy files
  copy LICENSE dist > nul
  copy README.md dist > nul
  copy package.json dist > nul
  echo Stage 3: Upgrade version
  cd dist/
  npm version %1
  npm publish
  echo Stage 4: Synchronize
  copy /Y package.json .. 2>nul
  cd ../
)