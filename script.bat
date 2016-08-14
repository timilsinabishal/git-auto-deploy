SET @localpath=%cd%
echo "Current directory is %@localpath%"
echo
echo "Stashing current work"
git stash
echo "Running git pull on %@localpath%"
git pull %1 %2
:: add your own script here for server restart options