environment=$1
hashProperty=$2

commitHash=$(git rev-parse HEAD)

if [ $environment == "local" ]
then
  sleepTime=0
  token="6b797b77ede6e61c84b865b44d2107ec629191c2f64d796dc53ff431e5c0cb09"
  baseUrl="https://localhost:8043"
fi

if [ $environment == "feature" ]
then
  sleepTime=60
  token="6b797b77ede6e61c84b865b44d2107ec629191c2f64d796dc53ff431e5c0cb09"
  baseUrl="https://platform-api-feature1.ematicsolutions.com"
fi

if [ $environment == "development" ]
then
  sleepTime=60
  token="6b797b77ede6e61c84b865b44d2107ec629191c2f64d796dc53ff431e5c0cb09"
  baseUrl="https://platform-api-development.ematicsolutions.com"
fi

if [ $environment == "staging" ]
then
  sleepTime=1
  token="6b797b77ede6e61c84b865b44d2107ec629191c2f64d796dc53ff431e5c0cb09"
  baseUrl="https://platform-api-staging.ematicsolutions.com"
fi

if [ $environment == "production" ]
then
  sleepTime=1
  token="506ce871d4b62887f5e2d3586a126a84c4c10b28e28782d43891ff18eed4805f"
  baseUrl="https://platform-api.ematicsolutions.com"
fi

sleep $sleepTime
curl -i \
-H "Authorization: Bearer $token" \
-H "Content-Type:application/json" \
-X POST \
--data '{"'"$hashProperty"'":"'"$commitHash"'"}' \
--insecure \
--fail \
"$baseUrl/api/internal/app-version/store-app-version"
