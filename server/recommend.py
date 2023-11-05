import json
import subprocess
import sys

def recommend(user_data_json):

  try:
    user_data = json.dumps(user_data_json)

  except json.decoder.JSONDecodeError:
    print('Error decoding user data:', user_data_json)
    return
  #recommendation system workplace
  

  print("hi")


if __name__ == '__main__':
  user_data_json = sys.argv[1]
  recommendations = recommend(user_data_json)