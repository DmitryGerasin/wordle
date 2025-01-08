import json
import glob

dictionariesFolder = './dictionary'
finalFormOfEpicDictionary = []


# get every dictionary except index.json
for dictionaryName in glob.iglob(f'{dictionariesFolder}/*.json'):
   # skip over index.json
   # if(dictionaryName == f'{dictionariesFolder}/index.json'): continue
   if(dictionaryName != f'{dictionariesFolder}/test.json'): continue

   # getting the content of the JSON file
   dictionaryContents = json.load(open(dictionaryName))

   # either it's a simple array ["a", "b", ...] and the dictionary is unweighted
   # or it's an array of arrays [ ["a", 1], ["b", 1], ... ] and the dictionary is weighted
   weighted = True # determine this
   
   
   if(weighted): 
      # 1. find dictionary with max "the" weight - that will be the absolute max
      # 2. for every other dictionary, multiply each weight by by `maxTheWeight / currentTheWeight`
      maxWeight = max(map(lambda one: (one[1], one[0].lower()), dictionaryContents))
      minWeight = min(map(lambda one: (one[1], one[0].lower()), dictionaryContents))
      print(dictionaryContents)
      print("max: ", maxWeight)
      print("min: ", minWeight)
   else: 
      print('2')



   # 1. Combine weighted dictionaries first and divide every weight by the smallest weight in the combined dictionary
   # so that the least common word weight is `1`
   # 2. Add unweighted dictionaries with all words weighing `1`

   # print(json.dumps(open(dictionaryName), sort_keys=True, indent=3))

   # with open(dictionaryName) as file:
   #    dict_3 = dict.fromkeys(json.load(file), 1)
   #    dict_3 = dict(map(lambda elem: (elem[0].lower(), elem[1]), dict_3.items()))

