/* サンプルのレシピ（初回起動時と「サンプルを追加」で読み込まれます）
   数値はすべて目安です */
window.SAMPLE_RECIPES = [
 {
  "id": "sample-taco-rice",
  "cat": "main",
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
  "cat": "main",
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
  "color": "#e3eed5",
  "createdAt": 1793491260000,
  "updatedAt": 1793491260000
 },
 {
  "id": "sample-salmon",
  "cat": "main",
  "name": "鮭の西京焼き定食",
  "desc": "一晩漬けた鮭をじっくり焼き上げた、ほっとする和定食。",
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
   },
   {
    "name": "ごはん",
    "amount": 160,
    "unit": "g"
   },
   {
    "name": "小松菜",
    "amount": 50,
    "unit": "g"
   },
   {
    "name": "豆腐",
    "amount": 50,
    "unit": "g"
   },
   {
    "name": "わかめ（乾燥）",
    "amount": 1,
    "unit": "g"
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
   },
   {
    "name": "だし汁",
    "amount": 150,
    "unit": "ml"
   },
   {
    "name": "味噌",
    "amount": 2,
    "unit": "小さじ"
   },
   {
    "name": "醤油",
    "amount": 0.5,
    "unit": "小さじ"
   }
  ],
  "nutrition": {
   "kcal": 560,
   "protein": 31,
   "fat": 9.5,
   "carbs": 80.5,
   "fiber": 2.8,
   "salt": 3
  },
  "steps": [
   "西京味噌とみりんを混ぜ、鮭に塗って冷蔵庫で一晩漬ける。",
   "味噌を拭き取り、弱めの中火でこげないように焼く。",
   "小松菜はゆでて醤油で和える。",
   "だし汁に豆腐とわかめを入れ、味噌を溶いて味噌汁を作る。"
  ],
  "memo": "",
  "color": "#fbe0d8",
  "createdAt": 1793491320000,
  "updatedAt": 1793491320000
 },
 {
  "id": "sample-avocado-toast",
  "cat": "main",
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
  "color": "#e6efd0",
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
  "cat": "side",
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
  "color": "#fdebc8",
  "createdAt": 1793491500000,
  "updatedAt": 1793491500000
 },
 {
  "id": "sample-minestrone",
  "cat": "side",
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
  "color": "#fbdcd5",
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
  "color": "#fdeec0",
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
  "color": "#fbf0c9",
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
  "color": "#fbf4c4",
  "createdAt": 1793491800000,
  "updatedAt": 1793491800000
 }
];
