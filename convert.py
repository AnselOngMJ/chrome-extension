import json

dic = {}
with open("cedict_ts.u8", "r", encoding="utf8") as file:
    for line in file:
        line = line.split()
        if len(line) > 1 and len(line[0]) == 1 and len(line[1]) == 1 and line[0] != line[1] and line[0] not in dic:
            dic[line[0]] = line[1]

with open('data.js', 'w') as file:
    file.write("const cedict = ")
    json.dump(dic, file)
    file.write(";")
