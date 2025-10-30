#!/bin/bash

API_URL="http://localhost:8080/api/report"

data1='{"name": "Alice Smith", "phoneNumber": "555-1234", "location": "Chicago", "creditScore": 720, "tenure": 5}'
data2='{"name": "Bob Johnson", "phoneNumber": "555-5678", "location": "New York", "creditScore": 680, "tenure": 3}'
data3='{"name": "Carol Lee", "phoneNumber": "555-8765", "location": "San Francisco", "creditScore": 750, "tenure": 7}'
data4='{"name": "David Kim", "phoneNumber": "555-4321", "location": "Austin", "creditScore": 710, "tenure": 2}'
data5='{"name": "Eva Brown", "phoneNumber": "555-2468", "location": "Seattle", "creditScore": 690, "tenure": 4}'

curl -X POST "$API_URL" -H "Content-Type: application/json" -d "$data1"
echo
curl -X POST "$API_URL" -H "Content-Type: application/json" -d "$data2"
echo
curl -X POST "$API_URL" -H "Content-Type: application/json" -d "$data3"
echo
curl -X POST "$API_URL" -H "Content-Type: application/json" -d "$data4"
echo
curl -X POST "$API_URL" -H "Content-Type: application/json" -d "$data5"
echo
