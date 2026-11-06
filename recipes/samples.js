/* サンプルのレシピ（初回起動時と「サンプルを追加」で読み込まれます）
   数値はすべて目安です */
window.SAMPLE_RECIPES = [
 {
  "id": "sample-taco-rice",
  "cat": "staple",
  "name": "ひなたのタコライス",
  "desc": "スパイスで炒めたひき肉と、たっぷりの生野菜をごはんにのせて。",
  "servings": 1,
  "veg": false,
  "favorite": true,
  "time": {
   "prep": 10,
   "cook": 10,
   "rest": 0
  },
  "allergens": [
   "乳",
   "小麦"
  ],
  "ingredients": [
   {
    "name": "ごはん",
    "amount": 180,
    "unit": "g"
   },
   {
    "name": "合いびき肉",
    "amount": 80,
    "unit": "g"
   },
   {
    "name": "玉ねぎ",
    "amount": 40,
    "unit": "g"
   },
   {
    "name": "レタス",
    "amount": 2,
    "unit": "枚"
   },
   {
    "name": "トマト",
    "amount": 0.5,
    "unit": "個"
   },
   {
    "name": "ピザ用チーズ",
    "amount": 20,
    "unit": "g"
   }
  ],
  "seasonings": [
   {
    "name": "ケチャップ",
    "amount": 1,
    "unit": "大さじ"
   },
   {
    "name": "ウスターソース",
    "amount": 1,
    "unit": "小さじ"
   },
   {
    "name": "カレー粉",
    "amount": 0.5,
    "unit": "小さじ"
   },
   {
    "name": "塩・こしょう",
    "amount": null,
    "unit": "少々"
   },
   {
    "name": "オリーブオイル",
    "amount": 1,
    "unit": "小さじ"
   }
  ],
  "nutrition": {
   "kcal": 640,
   "protein": 23.5,
   "fat": 22,
   "carbs": 82,
   "fiber": 3.2,
   "salt": 2.1
  },
  "steps": [
   "玉ねぎはみじん切り、レタスは千切り、トマトは角切りにする。",
   "フライパンにオリーブオイルを熱し、玉ねぎとひき肉を炒める。",
   "ケチャップ・ソース・カレー粉を加え、汁気がなくなるまで炒めて塩・こしょうで味を調える。",
   "ごはんにレタス、ひき肉、トマト、チーズの順にのせる。"
  ],
  "memo": "",
  "color": "#fde7cf",
  "createdAt": 1793491200000,
  "updatedAt": 1793491200000
 },
 {
  "id": "sample-veg-curry",
  "cat": "staple",
  "name": "季節野菜のグリーンカレー",
  "desc": "ココナッツミルクのまろやかさと、素揚げ野菜の甘みが広がります。",
  "servings": 1,
  "veg": true,
  "favorite": false,
  "time": {
   "prep": 15,
   "cook": 20,
   "rest": 0
  },
  "allergens": [],
  "ingredients": [
   {
    "name": "ごはん",
    "amount": 180,
    "unit": "g"
   },
   {
    "name": "なす",
    "amount": 0.5,
    "unit": "本"
   },
   {
    "name": "かぼちゃ",
    "amount": 50,
    "unit": "g"
   },
   {
    "name": "パプリカ",
    "amount": 0.25,
    "unit": "個"
   },
   {
    "name": "しめじ",
    "amount": 30,
    "unit": "g"
   },
   {
    "name": "ココナッツミルク",
    "amount": 150,
    "unit": "ml"
   }
  ],
  "seasonings": [
   {
    "name": "グリーンカレーペースト",
    "amount": 1,
    "unit": "大さじ"
   },
   {
    "name": "きび砂糖",
    "amount": 1,
    "unit": "小さじ"
   },
   {
    "name": "塩",
    "amount": null,
    "unit": "少々"
   },
   {
    "name": "米油",
    "amount": 1,
    "unit": "大さじ"
   }
  ],
  "nutrition": {
   "kcal": 720,
   "protein": 9.8,
   "fat": 34.5,
   "carbs": 92,
   "fiber": 5.6,
   "salt": 1.8
  },
  "steps": [
   "野菜は食べやすい大きさに切る。",
   "鍋に米油を熱し、カレーペーストを香りが立つまで炒める。",
   "野菜を加えて炒め、ココナッツミルクと砂糖を入れて10分煮る。",
   "塩で味を調え、ごはんと一緒に盛り付ける。"
  ],
  "memo": "",
  "color": "#fde7cf",
  "createdAt": 1793491260000,
  "updatedAt": 1793491260000
 },
 {
  "id": "sample-salmon",
  "cat": "main",
  "name": "鮭の西京焼き",
  "desc": "一晩漬けた鮭を、こがさないようにじっくり焼き上げます。",
  "servings": 1,
  "veg": false,
  "favorite": true,
  "time": {
   "prep": 5,
   "cook": 12,
   "rest": 480
  },
  "allergens": [
   "大豆"
  ],
  "ingredients": [
   {
    "name": "生鮭",
    "amount": 1,
    "unit": "切れ"
   }
  ],
  "seasonings": [
   {
    "name": "西京味噌",
    "amount": 1.5,
    "unit": "大さじ"
   },
   {
    "name": "みりん",
    "amount": 1,
    "unit": "小さじ"
   }
  ],
  "nutrition": {
   "kcal": 210,
   "protein": 23.5,
   "fat": 5.8,
   "carbs": 11,
   "fiber": 0.6,
   "salt": 1.5
  },
  "steps": [
   "西京味噌とみりんを混ぜ、鮭に塗って冷蔵庫で一晩漬ける。",
   "味噌を拭き取り、弱めの中火でこげないように焼く。"
  ],
  "memo": "",
  "color": "#fbdcd5",
  "createdAt": 1793491320000,
  "updatedAt": 1793491320000
 },
 {
  "id": "sample-avocado-toast",
  "cat": "staple",
  "name": "アボカドエッグトースト",
  "desc": "厚切りトーストにアボカドと半熟卵。朝ごはんにもぴったり。",
  "servings": 1,
  "veg": true,
  "favorite": false,
  "time": {
   "prep": 5,
   "cook": 8,
   "rest": 0
  },
  "allergens": [
   "卵",
   "小麦",
   "乳"
  ],
  "ingredients": [
   {
    "name": "食パン（4枚切り）",
    "amount": 1,
    "unit": "枚"
   },
   {
    "name": "アボカド",
    "amount": 0.5,
    "unit": "個"
   },
   {
    "name": "卵",
    "amount": 1,
    "unit": "個"
   },
   {
    "name": "ミニトマト",
    "amount": 3,
    "unit": "個"
   }
  ],
  "seasonings": [
   {
    "name": "レモン汁",
    "amount": 1,
    "unit": "小さじ"
   },
   {
    "name": "オリーブオイル",
    "amount": 1,
    "unit": "小さじ"
   },
   {
    "name": "塩",
    "amount": null,
    "unit": "少々"
   },
   {
    "name": "ブラックペッパー",
    "amount": null,
    "unit": "少々"
   }
  ],
  "nutrition": {
   "kcal": 430,
   "protein": 14.2,
   "fat": 21,
   "carbs": 45.5,
   "fiber": 6.1,
   "salt": 1.4
  },
  "steps": [
   "卵を沸騰したお湯で6分半ゆで、冷水にとって殻をむく。",
   "アボカドをつぶし、レモン汁と塩を混ぜる。",
   "パンをこんがり焼き、アボカドを塗る。",
   "半分に切った卵とミニトマトをのせ、オリーブオイルとペッパーをかける。"
  ],
  "memo": "",
  "color": "#fde7cf",
  "createdAt": 1793491380000,
  "updatedAt": 1793491380000
 },
 {
  "id": "sample-cobb-salad",
  "cat": "side",
  "name": "ひなたのコブサラダ",
  "desc": "彩り野菜とチキン、豆をたっぷり。食べごたえのあるサラダ。",
  "servings": 1,
  "veg": false,
  "favorite": false,
  "time": {
   "prep": 12,
   "cook": 0,
   "rest": 0
  },
  "allergens": [
   "卵"
  ],
  "ingredients": [
   {
    "name": "サラダチキン",
    "amount": 50,
    "unit": "g"
   },
   {
    "name": "ゆで卵",
    "amount": 0.5,
    "unit": "個"
   },
   {
    "name": "レタス",
    "amount": 60,
    "unit": "g"
   },
   {
    "name": "ミックスビーンズ",
    "amount": 30,
    "unit": "g"
   },
   {
    "name": "コーン",
    "amount": 20,
    "unit": "g"
   },
   {
    "name": "ミニトマト",
    "amount": 4,
    "unit": "個"
   }
  ],
  "seasonings": [
   {
    "name": "オリーブオイル",
    "amount": 1,
    "unit": "大さじ"
   },
   {
    "name": "酢",
    "amount": 2,
    "unit": "小さじ"
   },
   {
    "name": "粒マスタード",
    "amount": 1,
    "unit": "小さじ"
   },
   {
    "name": "はちみつ",
    "amount": 0.5,
    "unit": "小さじ"
   },
   {
    "name": "塩・こしょう",
    "amount": null,
    "unit": "少々"
   }
  ],
  "nutrition": {
   "kcal": 330,
   "protein": 21.5,
   "fat": 18,
   "carbs": 20.5,
   "fiber": 5.9,
   "salt": 1.3
  },
  "steps": [
   "具材をすべて1cm角に切る。",
   "調味料をよく混ぜてドレッシングを作る。",
   "レタスを敷いた器に具材を列に並べ、食べる直前にドレッシングをかける。"
  ],
  "memo": "",
  "color": "#e1efd9",
  "createdAt": 1793491440000,
  "updatedAt": 1793491440000
 },
 {
  "id": "sample-pumpkin-soup",
  "cat": "soup",
  "name": "かぼちゃのポタージュ",
  "desc": "北海道産かぼちゃのやさしい甘さ。なめらかな口あたりです。",
  "servings": 1,
  "veg": true,
  "favorite": true,
  "time": {
   "prep": 8,
   "cook": 15,
   "rest": 0
  },
  "allergens": [
   "乳"
  ],
  "ingredients": [
   {
    "name": "かぼちゃ",
    "amount": 100,
    "unit": "g"
   },
   {
    "name": "玉ねぎ",
    "amount": 30,
    "unit": "g"
   },
   {
    "name": "牛乳",
    "amount": 100,
    "unit": "ml"
   },
   {
    "name": "水",
    "amount": 50,
    "unit": "ml"
   }
  ],
  "seasonings": [
   {
    "name": "バター",
    "amount": 5,
    "unit": "g"
   },
   {
    "name": "コンソメ（顆粒）",
    "amount": 0.5,
    "unit": "小さじ"
   },
   {
    "name": "塩",
    "amount": null,
    "unit": "少々"
   }
  ],
  "nutrition": {
   "kcal": 190,
   "protein": 5.2,
   "fat": 8,
   "carbs": 25,
   "fiber": 3.6,
   "salt": 0.9
  },
  "steps": [
   "かぼちゃは皮をむいて薄切り、玉ねぎも薄切りにする。",
   "鍋にバターを溶かし、玉ねぎをしんなりするまで炒める。",
   "かぼちゃ・水・コンソメを加え、柔らかくなるまで煮る。",
   "ミキサーにかけて鍋に戻し、牛乳を加えて温め、塩で味を調える。"
  ],
  "memo": "",
  "color": "#fdeec0",
  "createdAt": 1793491500000,
  "updatedAt": 1793491500000
 },
 {
  "id": "sample-minestrone",
  "cat": "soup",
  "name": "具だくさんミネストローネ",
  "desc": "7種の野菜をトマトでじっくり煮込んだ、体が温まるスープ。",
  "servings": 1,
  "veg": true,
  "favorite": false,
  "time": {
   "prep": 10,
   "cook": 20,
   "rest": 0
  },
  "allergens": [],
  "ingredients": [
   {
    "name": "トマト缶（カット）",
    "amount": 100,
    "unit": "g"
   },
   {
    "name": "キャベツ",
    "amount": 40,
    "unit": "g"
   },
   {
    "name": "にんじん",
    "amount": 20,
    "unit": "g"
   },
   {
    "name": "玉ねぎ",
    "amount": 30,
    "unit": "g"
   },
   {
    "name": "セロリ",
    "amount": 15,
    "unit": "g"
   },
   {
    "name": "じゃがいも",
    "amount": 30,
    "unit": "g"
   },
   {
    "name": "水",
    "amount": 150,
    "unit": "ml"
   }
  ],
  "seasonings": [
   {
    "name": "オリーブオイル",
    "amount": 1,
    "unit": "小さじ"
   },
   {
    "name": "にんにく",
    "amount": 0.5,
    "unit": "片"
   },
   {
    "name": "コンソメ（顆粒）",
    "amount": 1,
    "unit": "小さじ"
   },
   {
    "name": "塩・こしょう",
    "amount": null,
    "unit": "少々"
   }
  ],
  "nutrition": {
   "kcal": 120,
   "protein": 3,
   "fat": 4.3,
   "carbs": 18,
   "fiber": 3.8,
   "salt": 1.2
  },
  "steps": [
   "野菜はすべて1cm角に切り、にんにくはみじん切りにする。",
   "鍋にオリーブオイルとにんにくを入れて弱火にかけ、香りを出す。",
   "野菜を炒め、トマト缶・水・コンソメを加えて15分煮込む。",
   "塩・こしょうで味を調える。"
  ],
  "memo": "",
  "color": "#fdeec0",
  "createdAt": 1793491560000,
  "updatedAt": 1793491560000
 },
 {
  "id": "sample-pudding",
  "cat": "sweets",
  "name": "昔ながらの固めプリン",
  "desc": "卵の風味がしっかり感じられる、ほろ苦カラメルのプリン。",
  "servings": 1,
  "veg": true,
  "favorite": true,
  "time": {
   "prep": 10,
   "cook": 30,
   "rest": 120
  },
  "allergens": [
   "卵",
   "乳"
  ],
  "ingredients": [
   {
    "name": "卵",
    "amount": 1,
    "unit": "個"
   },
   {
    "name": "牛乳",
    "amount": 100,
    "unit": "ml"
   }
  ],
  "seasonings": [
   {
    "name": "グラニュー糖（プリン液）",
    "amount": 1.5,
    "unit": "大さじ"
   },
   {
    "name": "グラニュー糖（カラメル）",
    "amount": 1,
    "unit": "大さじ"
   },
   {
    "name": "水（カラメル）",
    "amount": 1,
    "unit": "小さじ"
   },
   {
    "name": "バニラエッセンス",
    "amount": null,
    "unit": "少々"
   }
  ],
  "nutrition": {
   "kcal": 230,
   "protein": 9,
   "fat": 8.5,
   "carbs": 29,
   "fiber": 0,
   "salt": 0.3
  },
  "steps": [
   "砂糖と水を火にかけ、茶色く色づいたらカラメルとして型に流す。",
   "牛乳と砂糖を温め、溶いた卵とバニラを混ぜてこす。",
   "型に流し、150℃のオーブンで湯せん焼きを30分。",
   "粗熱をとり、冷蔵庫で2時間以上冷やす。"
  ],
  "memo": "",
  "color": "#f8e1ec",
  "createdAt": 1793491620000,
  "updatedAt": 1793491620000
 },
 {
  "id": "sample-banana-cake",
  "cat": "sweets",
  "name": "バナナとくるみのケーキ",
  "desc": "完熟バナナをたっぷり練り込んだ、しっとり焼き菓子。",
  "servings": 1,
  "veg": true,
  "favorite": false,
  "time": {
   "prep": 15,
   "cook": 40,
   "rest": 0
  },
  "allergens": [
   "卵",
   "小麦",
   "乳",
   "くるみ"
  ],
  "ingredients": [
   {
    "name": "完熟バナナ",
    "amount": 0.5,
    "unit": "本"
   },
   {
    "name": "薄力粉",
    "amount": 25,
    "unit": "g"
   },
   {
    "name": "卵",
    "amount": 0.25,
    "unit": "個"
   },
   {
    "name": "くるみ",
    "amount": 5,
    "unit": "g"
   }
  ],
  "seasonings": [
   {
    "name": "きび砂糖",
    "amount": 15,
    "unit": "g"
   },
   {
    "name": "無塩バター",
    "amount": 15,
    "unit": "g"
   },
   {
    "name": "ベーキングパウダー",
    "amount": 0.25,
    "unit": "小さじ"
   }
  ],
  "nutrition": {
   "kcal": 280,
   "protein": 4,
   "fat": 14.5,
   "carbs": 35,
   "fiber": 1.4,
   "salt": 0.1
  },
  "steps": [
   "バターを室温に戻し、砂糖とすり混ぜる。",
   "溶き卵とつぶしたバナナを加えてよく混ぜる。",
   "薄力粉とベーキングパウダーをふるい入れ、くるみを加えて混ぜる。",
   "型に流し、170℃のオーブンで40分焼く。"
  ],
  "memo": "",
  "color": "#f8e1ec",
  "createdAt": 1793491680000,
  "updatedAt": 1793491680000
 },
 {
  "id": "sample-hojicha-latte",
  "cat": "drink",
  "name": "ほうじ茶ラテ",
  "desc": "香ばしいほうじ茶とミルクの、ほっとする組み合わせ。",
  "servings": 1,
  "veg": true,
  "favorite": false,
  "time": {
   "prep": 2,
   "cook": 5,
   "rest": 0
  },
  "allergens": [
   "乳"
  ],
  "ingredients": [
   {
    "name": "ほうじ茶（茶葉）",
    "amount": 5,
    "unit": "g"
   },
   {
    "name": "お湯",
    "amount": 60,
    "unit": "ml"
   },
   {
    "name": "牛乳",
    "amount": 150,
    "unit": "ml"
   }
  ],
  "seasonings": [
   {
    "name": "きび砂糖",
    "amount": 1,
    "unit": "小さじ"
   }
  ],
  "nutrition": {
   "kcal": 120,
   "protein": 5,
   "fat": 5.7,
   "carbs": 12.5,
   "fiber": 0,
   "salt": 0.2
  },
  "steps": [
   "茶葉に熱湯を注ぎ、3分蒸らして濃いめに抽出する。",
   "牛乳を温め、泡立てる。",
   "茶こしでこしたほうじ茶と砂糖をカップに入れ、ミルクを注ぐ。"
  ],
  "memo": "",
  "color": "#eee3d3",
  "createdAt": 1793491740000,
  "updatedAt": 1793491740000
 },
 {
  "id": "sample-lemon-soda",
  "cat": "drink",
  "name": "自家製レモンスカッシュ",
  "desc": "国産レモンを漬けたシロップで作る、爽やかな一杯。",
  "servings": 1,
  "veg": true,
  "favorite": false,
  "time": {
   "prep": 3,
   "cook": 0,
   "rest": 0
  },
  "allergens": [],
  "ingredients": [
   {
    "name": "レモン（スライス）",
    "amount": 2,
    "unit": "枚"
   },
   {
    "name": "炭酸水",
    "amount": 150,
    "unit": "ml"
   },
   {
    "name": "氷",
    "amount": 5,
    "unit": "個"
   }
  ],
  "seasonings": [
   {
    "name": "レモンシロップ",
    "amount": 2,
    "unit": "大さじ"
   },
   {
    "name": "レモン汁",
    "amount": 1,
    "unit": "小さじ"
   }
  ],
  "nutrition": {
   "kcal": 85,
   "protein": 0.1,
   "fat": 0,
   "carbs": 21,
   "fiber": 0.3,
   "salt": 0
  },
  "steps": [
   "グラスに氷とレモンシロップ、レモン汁を入れる。",
   "炭酸水を静かに注ぎ、軽く混ぜる。",
   "レモンスライスを浮かべる。"
  ],
  "memo": "",
  "color": "#eee3d3",
  "createdAt": 1793491800000,
  "updatedAt": 1793491800000
 },
 {
  "id": "sample-teriyaki",
  "cat": "main",
  "name": "鶏の照り焼き",
  "desc": "甘辛いたれをからめた、ごはんがすすむ定番のおかず。",
  "servings": 1,
  "veg": false,
  "favorite": false,
  "time": {
   "prep": 5,
   "cook": 15,
   "rest": 0
  },
  "allergens": [
   "小麦",
   "大豆"
  ],
  "ingredients": [
   {
    "name": "鶏もも肉",
    "amount": 150,
    "unit": "g"
   },
   {
    "name": "ししとう",
    "amount": 4,
    "unit": "本"
   }
  ],
  "seasonings": [
   {
    "name": "醤油",
    "amount": 1,
    "unit": "大さじ"
   },
   {
    "name": "みりん",
    "amount": 1,
    "unit": "大さじ"
   },
   {
    "name": "砂糖",
    "amount": 1,
    "unit": "小さじ"
   },
   {
    "name": "サラダ油",
    "amount": 1,
    "unit": "小さじ"
   }
  ],
  "nutrition": {
   "kcal": 360,
   "protein": 26,
   "fat": 21,
   "carbs": 12,
   "fiber": 0.6,
   "salt": 2
  },
  "steps": [
   "鶏肉は厚い部分を開き、フォークで数か所穴をあける。",
   "フライパンに油を熱し、皮目から中火で焼く。ししとうも一緒に焼いて取り出す。",
   "裏返してふたをし、5分ほど蒸し焼きにする。",
   "調味料を加え、とろみがつくまで煮からめる。"
  ],
  "memo": "",
  "color": "#fbdcd5",
  "createdAt": 1793494860000,
  "updatedAt": 1793494860000
 },
 {
  "id": "sample-shogayaki",
  "cat": "main",
  "name": "豚の生姜焼き",
  "desc": "しょうがの香りがきいた、さっと作れる一品。",
  "servings": 1,
  "veg": false,
  "favorite": false,
  "time": {
   "prep": 5,
   "cook": 10,
   "rest": 0
  },
  "allergens": [
   "小麦",
   "大豆"
  ],
  "ingredients": [
   {
    "name": "豚ロース薄切り肉",
    "amount": 120,
    "unit": "g"
   },
   {
    "name": "玉ねぎ",
    "amount": 0.25,
    "unit": "個"
   },
   {
    "name": "キャベツ（千切り）",
    "amount": 50,
    "unit": "g"
   }
  ],
  "seasonings": [
   {
    "name": "醤油",
    "amount": 1,
    "unit": "大さじ"
   },
   {
    "name": "みりん",
    "amount": 1,
    "unit": "大さじ"
   },
   {
    "name": "酒",
    "amount": 1,
    "unit": "大さじ"
   },
   {
    "name": "しょうが（すりおろし）",
    "amount": 1,
    "unit": "小さじ"
   },
   {
    "name": "サラダ油",
    "amount": 1,
    "unit": "小さじ"
   }
  ],
  "nutrition": {
   "kcal": 400,
   "protein": 24,
   "fat": 25,
   "carbs": 15,
   "fiber": 1.6,
   "salt": 2.4
  },
  "steps": [
   "調味料を混ぜておく。玉ねぎは薄切りにする。",
   "フライパンに油を熱し、豚肉と玉ねぎを炒める。",
   "肉の色が変わったら調味料を加えてからめる。",
   "キャベツと一緒に盛り付ける。"
  ],
  "memo": "",
  "color": "#fbdcd5",
  "createdAt": 1793494920000,
  "updatedAt": 1793494920000
 },
 {
  "id": "sample-saba-miso",
  "cat": "main",
  "name": "さばの味噌煮",
  "desc": "味噌のこくがしみた、ほっとする和のおかず。",
  "servings": 1,
  "veg": false,
  "favorite": false,
  "time": {
   "prep": 5,
   "cook": 15,
   "rest": 0
  },
  "allergens": [
   "大豆"
  ],
  "ingredients": [
   {
    "name": "さば",
    "amount": 1,
    "unit": "切れ"
   },
   {
    "name": "しょうが",
    "amount": 0.5,
    "unit": "片"
   },
   {
    "name": "長ねぎ",
    "amount": 0.25,
    "unit": "本"
   }
  ],
  "seasonings": [
   {
    "name": "味噌",
    "amount": 1,
    "unit": "大さじ"
   },
   {
    "name": "砂糖",
    "amount": 1.5,
    "unit": "小さじ"
   },
   {
    "name": "酒",
    "amount": 1,
    "unit": "大さじ"
   },
   {
    "name": "水",
    "amount": 100,
    "unit": "ml"
   }
  ],
  "nutrition": {
   "kcal": 300,
   "protein": 21,
   "fat": 17,
   "carbs": 13,
   "fiber": 1,
   "salt": 2
  },
  "steps": [
   "さばは皮に切り込みを入れ、熱湯をかけて臭みをとる。",
   "鍋に水・酒・砂糖・薄切りのしょうがを入れて煮立てる。",
   "さばとねぎを入れ、味噌を溶き入れて落としぶたをし、10分煮る。"
  ],
  "memo": "",
  "color": "#fbdcd5",
  "createdAt": 1793494980000,
  "updatedAt": 1793494980000
 },
 {
  "id": "sample-nikujaga",
  "cat": "main",
  "name": "肉じゃが",
  "desc": "ほくほくのじゃがいもに、甘辛い味がしみ込みます。",
  "servings": 1,
  "veg": false,
  "favorite": false,
  "time": {
   "prep": 10,
   "cook": 20,
   "rest": 0
  },
  "allergens": [
   "小麦",
   "大豆"
  ],
  "ingredients": [
   {
    "name": "牛こま切れ肉",
    "amount": 60,
    "unit": "g"
   },
   {
    "name": "じゃがいも",
    "amount": 1,
    "unit": "個"
   },
   {
    "name": "玉ねぎ",
    "amount": 0.25,
    "unit": "個"
   },
   {
    "name": "にんじん",
    "amount": 0.25,
    "unit": "本"
   }
  ],
  "seasonings": [
   {
    "name": "醤油",
    "amount": 1,
    "unit": "大さじ"
   },
   {
    "name": "みりん",
    "amount": 1,
    "unit": "大さじ"
   },
   {
    "name": "砂糖",
    "amount": 2,
    "unit": "小さじ"
   },
   {
    "name": "だし汁",
    "amount": 150,
    "unit": "ml"
   }
  ],
  "nutrition": {
   "kcal": 330,
   "protein": 13,
   "fat": 12,
   "carbs": 41,
   "fiber": 3,
   "salt": 2.3
  },
  "steps": [
   "じゃがいも・にんじんは一口大、玉ねぎはくし形に切る。",
   "鍋で牛肉を炒め、野菜を加えてさらに炒める。",
   "だし汁と調味料を加え、落としぶたをして15分煮る。"
  ],
  "memo": "",
  "color": "#fbdcd5",
  "createdAt": 1793495040000,
  "updatedAt": 1793495040000
 },
 {
  "id": "sample-ohitashi",
  "cat": "side",
  "name": "ほうれん草のおひたし",
  "desc": "だしをきかせた、シンプルな青菜の小鉢。",
  "servings": 1,
  "veg": false,
  "favorite": false,
  "time": {
   "prep": 5,
   "cook": 3,
   "rest": 0
  },
  "allergens": [
   "小麦",
   "大豆"
  ],
  "ingredients": [
   {
    "name": "ほうれん草",
    "amount": 80,
    "unit": "g"
   },
   {
    "name": "かつお節",
    "amount": 1,
    "unit": "g"
   }
  ],
  "seasonings": [
   {
    "name": "醤油",
    "amount": 1,
    "unit": "小さじ"
   },
   {
    "name": "だし汁",
    "amount": 1,
    "unit": "大さじ"
   }
  ],
  "nutrition": {
   "kcal": 25,
   "protein": 2.6,
   "fat": 0.4,
   "carbs": 3,
   "fiber": 2.3,
   "salt": 0.9
  },
  "steps": [
   "ほうれん草をさっとゆでて水にとり、水気を絞る。",
   "4cm長さに切り、醤油とだし汁であえる。",
   "かつお節をのせる。"
  ],
  "memo": "",
  "color": "#e1efd9",
  "createdAt": 1793495100000,
  "updatedAt": 1793495100000
 },
 {
  "id": "sample-kinpira",
  "cat": "side",
  "name": "きんぴらごぼう",
  "desc": "ごま油の香りと、ごぼうの歯ごたえが楽しい常備菜。",
  "servings": 1,
  "veg": false,
  "favorite": false,
  "time": {
   "prep": 7,
   "cook": 6,
   "rest": 0
  },
  "allergens": [
   "小麦",
   "大豆",
   "ごま"
  ],
  "ingredients": [
   {
    "name": "ごぼう",
    "amount": 40,
    "unit": "g"
   },
   {
    "name": "にんじん",
    "amount": 15,
    "unit": "g"
   },
   {
    "name": "いりごま",
    "amount": 0.5,
    "unit": "小さじ"
   }
  ],
  "seasonings": [
   {
    "name": "醤油",
    "amount": 1.5,
    "unit": "小さじ"
   },
   {
    "name": "みりん",
    "amount": 1.5,
    "unit": "小さじ"
   },
   {
    "name": "砂糖",
    "amount": 0.5,
    "unit": "小さじ"
   },
   {
    "name": "ごま油",
    "amount": 1,
    "unit": "小さじ"
   }
  ],
  "nutrition": {
   "kcal": 95,
   "protein": 1.5,
   "fat": 4.8,
   "carbs": 12,
   "fiber": 2.6,
   "salt": 0.9
  },
  "steps": [
   "ごぼうとにんじんを細切りにする。",
   "ごま油で炒め、しんなりしたら調味料を加えて汁気がなくなるまで炒める。",
   "いりごまをふる。"
  ],
  "memo": "",
  "color": "#e1efd9",
  "createdAt": 1793495160000,
  "updatedAt": 1793495160000
 },
 {
  "id": "sample-hijiki",
  "cat": "side",
  "name": "ひじきの煮物",
  "desc": "作りおきにも便利な、栄養たっぷりの煮物。",
  "servings": 1,
  "veg": false,
  "favorite": false,
  "time": {
   "prep": 10,
   "cook": 10,
   "rest": 20
  },
  "allergens": [
   "小麦",
   "大豆"
  ],
  "ingredients": [
   {
    "name": "ひじき（乾燥）",
    "amount": 5,
    "unit": "g"
   },
   {
    "name": "にんじん",
    "amount": 15,
    "unit": "g"
   },
   {
    "name": "油揚げ",
    "amount": 0.25,
    "unit": "枚"
   },
   {
    "name": "大豆（水煮）",
    "amount": 15,
    "unit": "g"
   }
  ],
  "seasonings": [
   {
    "name": "醤油",
    "amount": 1.5,
    "unit": "小さじ"
   },
   {
    "name": "砂糖",
    "amount": 1,
    "unit": "小さじ"
   },
   {
    "name": "だし汁",
    "amount": 50,
    "unit": "ml"
   },
   {
    "name": "サラダ油",
    "amount": 0.5,
    "unit": "小さじ"
   }
  ],
  "nutrition": {
   "kcal": 90,
   "protein": 4,
   "fat": 4.5,
   "carbs": 9,
   "fiber": 3.5,
   "salt": 1
  },
  "steps": [
   "ひじきを水で20分戻す。にんじん・油揚げは細切りにする。",
   "油で具材を炒め、だし汁と調味料を加えて汁気が少なくなるまで煮る。"
  ],
  "memo": "",
  "color": "#e1efd9",
  "createdAt": 1793495220000,
  "updatedAt": 1793495220000
 },
 {
  "id": "sample-cabbage",
  "cat": "side",
  "name": "キャベツの塩昆布あえ",
  "desc": "あえるだけ。もう一品ほしいときに。",
  "servings": 1,
  "veg": false,
  "favorite": false,
  "time": {
   "prep": 5,
   "cook": 0,
   "rest": 10
  },
  "allergens": [],
  "ingredients": [
   {
    "name": "キャベツ",
    "amount": 60,
    "unit": "g"
   },
   {
    "name": "塩昆布",
    "amount": 3,
    "unit": "g"
   }
  ],
  "seasonings": [
   {
    "name": "ごま油",
    "amount": 0.5,
    "unit": "小さじ"
   }
  ],
  "nutrition": {
   "kcal": 35,
   "protein": 1.2,
   "fat": 2,
   "carbs": 4,
   "fiber": 1.2,
   "salt": 0.6
  },
  "steps": [
   "キャベツをざく切りにする。",
   "塩昆布とごま油を加えてもみ込み、10分おいてなじませる。"
  ],
  "memo": "",
  "color": "#e1efd9",
  "createdAt": 1793495280000,
  "updatedAt": 1793495280000
 },
 {
  "id": "sample-komatsuna",
  "cat": "side",
  "name": "小松菜とツナのあえもの",
  "desc": "ツナのうまみで、青菜がたっぷり食べられます。",
  "servings": 1,
  "veg": false,
  "favorite": false,
  "time": {
   "prep": 5,
   "cook": 3,
   "rest": 0
  },
  "allergens": [
   "小麦",
   "大豆"
  ],
  "ingredients": [
   {
    "name": "小松菜",
    "amount": 70,
    "unit": "g"
   },
   {
    "name": "ツナ缶",
    "amount": 20,
    "unit": "g"
   }
  ],
  "seasonings": [
   {
    "name": "醤油",
    "amount": 0.5,
    "unit": "小さじ"
   }
  ],
  "nutrition": {
   "kcal": 60,
   "protein": 5,
   "fat": 3.8,
   "carbs": 1.6,
   "fiber": 1.3,
   "salt": 0.5
  },
  "steps": [
   "小松菜をゆでて水気を絞り、4cm長さに切る。",
   "油をきったツナと醤油であえる。"
  ],
  "memo": "",
  "color": "#e1efd9",
  "createdAt": 1793495340000,
  "updatedAt": 1793495340000
 },
 {
  "id": "sample-misoshiru",
  "cat": "soup",
  "name": "豆腐とわかめの味噌汁",
  "desc": "毎日の献立に欠かせない、定番の汁物。",
  "servings": 1,
  "veg": false,
  "favorite": false,
  "time": {
   "prep": 3,
   "cook": 5,
   "rest": 0
  },
  "allergens": [
   "大豆"
  ],
  "ingredients": [
   {
    "name": "豆腐",
    "amount": 50,
    "unit": "g"
   },
   {
    "name": "わかめ（乾燥）",
    "amount": 1,
    "unit": "g"
   },
   {
    "name": "長ねぎ",
    "amount": 5,
    "unit": "g"
   }
  ],
  "seasonings": [
   {
    "name": "だし汁",
    "amount": 150,
    "unit": "ml"
   },
   {
    "name": "味噌",
    "amount": 2,
    "unit": "小さじ"
   }
  ],
  "nutrition": {
   "kcal": 55,
   "protein": 4.5,
   "fat": 2.5,
   "carbs": 3.5,
   "fiber": 1,
   "salt": 1.4
  },
  "steps": [
   "豆腐はさいの目に切り、ねぎは小口切りにする。",
   "だし汁を温めて豆腐とわかめを入れる。",
   "火を弱めて味噌を溶き入れ、ねぎを散らす。"
  ],
  "memo": "",
  "color": "#fdeec0",
  "createdAt": 1793495400000,
  "updatedAt": 1793495400000
 },
 {
  "id": "sample-tonjiru",
  "cat": "soup",
  "name": "豚汁",
  "desc": "根菜たっぷりで、体の芯から温まります。",
  "servings": 1,
  "veg": false,
  "favorite": false,
  "time": {
   "prep": 10,
   "cook": 15,
   "rest": 0
  },
  "allergens": [
   "大豆"
  ],
  "ingredients": [
   {
    "name": "豚こま切れ肉",
    "amount": 30,
    "unit": "g"
   },
   {
    "name": "大根",
    "amount": 30,
    "unit": "g"
   },
   {
    "name": "にんじん",
    "amount": 15,
    "unit": "g"
   },
   {
    "name": "ごぼう",
    "amount": 15,
    "unit": "g"
   },
   {
    "name": "長ねぎ",
    "amount": 10,
    "unit": "g"
   }
  ],
  "seasonings": [
   {
    "name": "だし汁",
    "amount": 180,
    "unit": "ml"
   },
   {
    "name": "味噌",
    "amount": 2.5,
    "unit": "小さじ"
   },
   {
    "name": "ごま油",
    "amount": 0.5,
    "unit": "小さじ"
   }
  ],
  "nutrition": {
   "kcal": 140,
   "protein": 7,
   "fat": 8.5,
   "carbs": 8,
   "fiber": 2,
   "salt": 1.6
  },
  "steps": [
   "野菜は薄いいちょう切りなどにする。",
   "鍋にごま油を熱し、豚肉と野菜を炒める。",
   "だし汁を加えて野菜が柔らかくなるまで煮る。",
   "味噌を溶き入れ、ねぎを散らす。"
  ],
  "memo": "",
  "color": "#fdeec0",
  "createdAt": 1793495460000,
  "updatedAt": 1793495460000
 },
 {
  "id": "sample-egg-soup",
  "cat": "soup",
  "name": "中華風卵スープ",
  "desc": "ふんわり卵の、やさしい味のスープ。",
  "servings": 1,
  "veg": false,
  "favorite": false,
  "time": {
   "prep": 2,
   "cook": 5,
   "rest": 0
  },
  "allergens": [
   "卵",
   "小麦",
   "大豆"
  ],
  "ingredients": [
   {
    "name": "卵",
    "amount": 0.5,
    "unit": "個"
   },
   {
    "name": "長ねぎ",
    "amount": 10,
    "unit": "g"
   },
   {
    "name": "水",
    "amount": 180,
    "unit": "ml"
   }
  ],
  "seasonings": [
   {
    "name": "鶏がらスープの素",
    "amount": 0.5,
    "unit": "小さじ"
   },
   {
    "name": "醤油",
    "amount": 0.5,
    "unit": "小さじ"
   },
   {
    "name": "片栗粉",
    "amount": 0.5,
    "unit": "小さじ"
   },
   {
    "name": "ごま油",
    "amount": null,
    "unit": "少々"
   }
  ],
  "nutrition": {
   "kcal": 50,
   "protein": 3.5,
   "fat": 3,
   "carbs": 2.5,
   "fiber": 0.2,
   "salt": 1.1
  },
  "steps": [
   "水とスープの素を煮立て、醤油で味を調える。",
   "水溶き片栗粉でとろみをつける。",
   "溶き卵を回し入れ、ねぎとごま油を加える。"
  ],
  "memo": "",
  "color": "#fdeec0",
  "createdAt": 1793495520000,
  "updatedAt": 1793495520000
 }
];
