npm run build
cd dist #go to build directory
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:ammlyy/spotify-playlist-viz.git master:gh-pages