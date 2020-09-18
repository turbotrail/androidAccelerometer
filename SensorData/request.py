import requests
import json
url="http://localhost:3000/data"
q={
"name":"MY product",
"sku":"JP1234",
"price":"200"
}
resp=requests.post(url,json=q)
print(resp.json())