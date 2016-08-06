SET @localpath=%cd%
echo "Current directory is %@var%"
echo
echo "Stashing current work"
git stash
echo "Running git pull on %@var%"
git pull origin master
:: add your own script here for server restart options