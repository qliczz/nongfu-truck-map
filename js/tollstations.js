/**
 * 高速收费站口数据（浙江 + 上海）
 * 通过高德POI API获取，坐标已转WGS-84
 * 包含高速收费站出入口信息
 */

const TOLL_STATIONS = [
  {
    "id": "toll-杭州-1",
    "name": "杭州北收费站(S16杭浦高速入口)",
    "highway": "S16",
    "lng": 120.246356,
    "lat": 30.35204,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-杭州-3",
    "name": "乔司东收费站(G2504杭州绕城高速出口下沙方向)",
    "highway": "G2504",
    "lng": 120.280926,
    "lat": 30.342865,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-杭州-4",
    "name": "萧山收费站(S2杭甬高速出口)",
    "highway": "S2",
    "lng": 120.348292,
    "lat": 30.226354,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-杭州-5",
    "name": "下沙南收费站(G60沪昆高速入口南向)",
    "highway": "G60",
    "lng": 120.348723,
    "lat": 30.278759,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-杭州-7",
    "name": "杭州南收费站(G25长深高速南向)",
    "highway": "G25",
    "lng": 120.107207,
    "lat": 30.143499,
    "region": "浙江·杭州",
    "direction": "出入口"
  },
  {
    "id": "toll-杭州-8",
    "name": "萧山东收费站(G60沪昆高速出口)",
    "highway": "G60",
    "lng": 120.336705,
    "lat": 30.178413,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-杭州-9",
    "name": "留下收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 120.044067,
    "lat": 30.242298,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-杭州-10",
    "name": "三墩收费站(留石高架路东向)",
    "highway": "高速公路",
    "lng": 120.057607,
    "lat": 30.305576,
    "region": "浙江·杭州",
    "direction": "出入口"
  },
  {
    "id": "toll-杭州-11",
    "name": "半山收费站(G2504杭州绕城高速出口)",
    "highway": "G2504",
    "lng": 120.192647,
    "lat": 30.389723,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-杭州-13",
    "name": "新街收费站(G60沪昆高速入口西南向)",
    "highway": "G60",
    "lng": 120.354928,
    "lat": 30.210705,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-杭州-14",
    "name": "转塘收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 120.081506,
    "lat": 30.150422,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-杭州-16",
    "name": "萧山南收费站(G2504杭州绕城高速出口)",
    "highway": "G2504",
    "lng": 120.24549,
    "lat": 30.107183,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-杭州-17",
    "name": "杭州西收费站(G56杭瑞高速入口西向)",
    "highway": "G56",
    "lng": 120.025302,
    "lat": 30.241277,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-杭州-18",
    "name": "南庄兜收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 120.115456,
    "lat": 30.378119,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-杭州-19",
    "name": "义桥收费站(时代高架路出口)",
    "highway": "高速公路",
    "lng": 120.186941,
    "lat": 30.095889,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-杭州-20",
    "name": "紫金港收费站(S14杭长宜高速入口东向)",
    "highway": "S14",
    "lng": 120.056305,
    "lat": 30.338982,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-杭州-21",
    "name": "临平东收费站(S16杭浦高速出口)",
    "highway": "S16",
    "lng": 120.323141,
    "lat": 30.37196,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-杭州-22",
    "name": "下沙收费站(G2504杭州绕城高速西向)",
    "highway": "G2504",
    "lng": 120.371516,
    "lat": 30.325717,
    "region": "浙江·杭州",
    "direction": "出入口"
  },
  {
    "id": "toll-杭州-24",
    "name": "杭州收费站(S2杭甬高速入口)",
    "highway": "S2",
    "lng": 120.252762,
    "lat": 30.331364,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-杭州-25",
    "name": "临平收费站(S2���甬高速入口)",
    "highway": "S2",
    "lng": 120.299806,
    "lat": 30.389021,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-杭州-29",
    "name": "良渚收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 120.064082,
    "lat": 30.36487,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-杭州-30",
    "name": "良渚收费站(G25长深高速入口)",
    "highway": "G25",
    "lng": 120.063671,
    "lat": 30.365117,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-杭州-32",
    "name": "崇贤收费站(S13练杭高速出口)",
    "highway": "S13",
    "lng": 120.15412,
    "lat": 30.40218,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-杭州-37",
    "name": "杭州萧山国际机场收费站(S4机场公路入口东向)",
    "highway": "S4",
    "lng": 120.385806,
    "lat": 30.218308,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-杭州-38",
    "name": "所前收费站(G2504杭州绕城高速出口)",
    "highway": "G2504",
    "lng": 120.294449,
    "lat": 30.086557,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-杭州-39",
    "name": "五常收费站(G25长深高速入口北向)",
    "highway": "G25",
    "lng": 120.042692,
    "lat": 30.280961,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-杭州-40",
    "name": "临浦收费站(G60沪昆高速出口)",
    "highway": "G60",
    "lng": 120.261887,
    "lat": 30.057006,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-杭州-42",
    "name": "龙坞收费站(G25长深高速入口北向)",
    "highway": "G25",
    "lng": 120.052669,
    "lat": 30.194124,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-杭州-45",
    "name": "瓜沥收费站(G92杭州湾环线高速出口宁波方向)",
    "highway": "G92",
    "lng": 120.446315,
    "lat": 30.195959,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-杭州-46",
    "name": "余杭收费站(G56杭瑞高速出口)",
    "highway": "G56",
    "lng": 119.956268,
    "lat": 30.251417,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-杭州-48",
    "name": "东洲岛收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 120.058254,
    "lat": 30.07414,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-杭州-49",
    "name": "仁和收费站(G25长深高速出口杭州方向)",
    "highway": "G25",
    "lng": 120.092917,
    "lat": 30.442683,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-杭州-50",
    "name": "塘栖收费站(S13练杭高速出口)",
    "highway": "S13",
    "lng": 120.152949,
    "lat": 30.46254,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-1",
    "name": "宁波东收费站(S5杭甬高速入口)",
    "highway": "S5",
    "lng": 121.594638,
    "lat": 29.842259,
    "region": "浙江·宁波",
    "direction": "入口"
  },
  {
    "id": "toll-宁波-2",
    "name": "宁波东收费站(S1甬台温高速出口)",
    "highway": "S1",
    "lng": 121.595026,
    "lat": 29.842251,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-3",
    "name": "东钱湖收费站(G1504宁波绕城高速出口)",
    "highway": "G1504",
    "lng": 121.636838,
    "lat": 29.815094,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-5",
    "name": "丁家山收费站(G1504宁波绕城高速出口北仑方向)",
    "highway": "G1504",
    "lng": 121.684453,
    "lat": 29.860734,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-6",
    "name": "鄞州收费站(S5杭甬高速入口西向)",
    "highway": "S5",
    "lng": 121.56152,
    "lat": 29.843604,
    "region": "浙江·宁波",
    "direction": "入口"
  },
  {
    "id": "toll-宁波-8",
    "name": "丁家山收费站(G1504宁波绕城高速出口象山方向)",
    "highway": "G1504",
    "lng": 121.689132,
    "lat": 29.869242,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-10",
    "name": "小港收费站(G1504宁波绕城高速出口)",
    "highway": "G1504",
    "lng": 121.682397,
    "lat": 29.912731,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-12",
    "name": "云龙收费站(G1523甬莞高速出口)",
    "highway": "G1523",
    "lng": 121.58371,
    "lat": 29.784233,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-14",
    "name": "临江收费站(G1504宁波绕城高速出口)",
    "highway": "G1504",
    "lng": 121.651236,
    "lat": 29.945421,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-16",
    "name": "蛟川收费站(G9211甬舟高速出口)",
    "highway": "G9211",
    "lng": 121.635295,
    "lat": 29.964638,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-17",
    "name": "鄞州东收费站(S1甬台温高速出口)",
    "highway": "S1",
    "lng": 121.731196,
    "lat": 29.827695,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-18",
    "name": "宁波收费站(S5杭甬高速出口)",
    "highway": "S5",
    "lng": 121.489791,
    "lat": 29.83996,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-21",
    "name": "灵峰收费站(S20穿山疏港高速出口)",
    "highway": "S20",
    "lng": 121.765897,
    "lat": 29.887525,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-22",
    "name": "沙河收费站(G1504宁波绕城高速出口)",
    "highway": "G1504",
    "lng": 121.6024,
    "lat": 29.997211,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-23",
    "name": "九龙湖收费站(G1504宁波绕城高速出口)",
    "highway": "G1504",
    "lng": 121.559352,
    "lat": 29.993628,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-24",
    "name": "保国寺收费站(G1504宁波绕城高速入口)",
    "highway": "G1504",
    "lng": 121.514558,
    "lat": 29.970374,
    "region": "浙江·宁波",
    "direction": "入口"
  },
  {
    "id": "toll-宁波-27",
    "name": "鄞州南收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 121.525902,
    "lat": 29.754198,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-28",
    "name": "朝阳收费站(G1504宁波绕城高速出口)",
    "highway": "G1504",
    "lng": 121.477754,
    "lat": 29.786905,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-30",
    "name": "横溪(东钱湖南)收费站(G1523甬莞高速入口)",
    "highway": "G1523",
    "lng": 121.607703,
    "lat": 29.744877,
    "region": "浙江·宁波",
    "direction": "入口"
  },
  {
    "id": "toll-宁波-31",
    "name": "招宝山收费站(G9221杭绍甬高速出口)",
    "highway": "G9221",
    "lng": 121.700519,
    "lat": 29.982546,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-32",
    "name": "北仑收费站(S1甬台温高速西南向)",
    "highway": "G92",
    "lng": 121.804599,
    "lat": 29.892633,
    "region": "浙江·宁波",
    "direction": "出入口"
  },
  {
    "id": "toll-宁波-34",
    "name": "宁波北收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 121.45339,
    "lat": 29.945373,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-35",
    "name": "宁波西收费站(G1512甬金高速出口)",
    "highway": "G1512",
    "lng": 121.429955,
    "lat": 29.812149,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-38",
    "name": "横街收费站(G1504宁波绕城高速出口)",
    "highway": "G1504",
    "lng": 121.412058,
    "lat": 29.852167,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-42",
    "name": "横溪(东钱湖南)收费站(G1523甬莞高速出口)",
    "highway": "G1523",
    "lng": 121.607715,
    "lat": 29.745115,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-44",
    "name": "洞桥收费站(G1512甬金高速出口)",
    "highway": "G1512",
    "lng": 121.391176,
    "lat": 29.783689,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-45",
    "name": "霞浦收费站(S20穿山疏港高速出口)",
    "highway": "S20",
    "lng": 121.874792,
    "lat": 29.875651,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-46",
    "name": "大隐收费站(G92杭州湾环线高速出口)",
    "highway": "G92",
    "lng": 121.377893,
    "lat": 29.940731,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-47",
    "name": "慈城收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 121.411782,
    "lat": 30.002674,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-48",
    "name": "塘溪收费站(G1523甬莞高速出口)",
    "highway": "G1523",
    "lng": 121.700857,
    "lat": 29.682954,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-49",
    "name": "澥浦收费站(G9221杭绍甬高速出口)",
    "highway": "G9221",
    "lng": 121.637761,
    "lat": 30.059773,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-51",
    "name": "咸祥收费站(G1523甬莞高速出口)",
    "highway": "G1523",
    "lng": 121.776821,
    "lat": 29.658208,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-52",
    "name": "奉化收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 121.453825,
    "lat": 29.66464,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-55",
    "name": "柴桥收费站(S20穿山疏港高速出口)",
    "highway": "S20",
    "lng": 121.924362,
    "lat": 29.869681,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-59",
    "name": "龙山收费站(G9221杭绍甬高速入口)",
    "highway": "G9221",
    "lng": 121.591865,
    "lat": 30.096272,
    "region": "浙江·宁波",
    "direction": "入口"
  },
  {
    "id": "toll-宁波-62",
    "name": "奉化溪口东滕头收费站(G1512甬金高速入口)",
    "highway": "G1512",
    "lng": 121.3335,
    "lat": 29.694623,
    "region": "浙江·宁波",
    "direction": "入口"
  },
  {
    "id": "toll-宁波-63",
    "name": "瞻岐收费站(S22象山湾疏港高速出口)",
    "highway": "S22",
    "lng": 121.790287,
    "lat": 29.715786,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-65",
    "name": "掌起收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 121.43844,
    "lat": 30.135588,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-67",
    "name": "大隐收费站(G92杭州湾环线高速入口西北向)",
    "highway": "G92",
    "lng": 121.385941,
    "lat": 29.940923,
    "region": "浙江·宁波",
    "direction": "入口"
  },
  {
    "id": "toll-宁波-68",
    "name": "象山北收费站(G1523甬莞高速出口)",
    "highway": "G1523",
    "lng": 121.814465,
    "lat": 29.574475,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-70",
    "name": "郭巨收费站(S20穿山疏港高速出口)",
    "highway": "S20",
    "lng": 122.017623,
    "lat": 29.859409,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-宁波-71",
    "name": "陆埠收费站(胜陆高架东北向)",
    "highway": "高速公路",
    "lng": 121.245166,
    "lat": 29.995108,
    "region": "浙江·宁波",
    "direction": "出入口"
  },
  {
    "id": "toll-宁波-72",
    "name": "陆埠收费站(胜陆高架西南向)",
    "highway": "高速公路",
    "lng": 121.244849,
    "lat": 29.994979,
    "region": "浙江·宁波",
    "direction": "出入口"
  },
  {
    "id": "toll-宁波-74",
    "name": "春晓收费站(S22象山湾疏港高速出口)",
    "highway": "S22",
    "lng": 121.877602,
    "lat": 29.765586,
    "region": "浙江·宁波",
    "direction": "出口"
  },
  {
    "id": "toll-温州-1",
    "name": "温州东收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 120.75154,
    "lat": 27.971275,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-3",
    "name": "温州南收费站(G1513温丽高速出口)",
    "highway": "G1513",
    "lng": 120.686368,
    "lat": 27.936257,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-4",
    "name": "七都西收费站(G15沈海高速出口七都方向)",
    "highway": "G15",
    "lng": 120.770186,
    "lat": 28.003274,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-5",
    "name": "七都东收费站(G15沈海高速入口东北向)",
    "highway": "G15",
    "lng": 120.77272,
    "lat": 28.00174,
    "region": "浙江·温州",
    "direction": "入口"
  },
  {
    "id": "toll-温州-7",
    "name": "温州北收费站(S26诸永高速出口罗东方向)",
    "highway": "S26",
    "lng": 120.708276,
    "lat": 28.076016,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-11",
    "name": "瑶溪收费站(S40龙湾联络线出口)",
    "highway": "S40",
    "lng": 120.75899,
    "lat": 27.936846,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-14",
    "name": "收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 120.777127,
    "lat": 28.004701,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-16",
    "name": "大桥北收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 120.792126,
    "lat": 28.024061,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-18",
    "name": "温州西收费站(G1513温丽高速出口)",
    "highway": "G1513",
    "lng": 120.59143,
    "lat": 28.021905,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-19",
    "name": "娄桥收费站(G1513温丽高速出口)",
    "highway": "G1513",
    "lng": 120.591229,
    "lat": 27.969348,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-21",
    "name": "永嘉南收费站(S10温州绕城高速出口)",
    "highway": "S10",
    "lng": 120.68455,
    "lat": 28.087693,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-22",
    "name": "瓯北收费站(S10温州绕城高速出口)",
    "highway": "S10",
    "lng": 120.607073,
    "lat": 28.074643,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-25",
    "name": "仰义收费站(S10温州绕城高速出口)",
    "highway": "S10",
    "lng": 120.574401,
    "lat": 28.078677,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-26",
    "name": "三溪收费站(S10温州绕城高速入口)",
    "highway": "S10",
    "lng": 120.544985,
    "lat": 27.97385,
    "region": "浙江·温州",
    "direction": "入口"
  },
  {
    "id": "toll-温州-27",
    "name": "潘桥收费站(S10温州绕城高速入口)",
    "highway": "S10",
    "lng": 120.560462,
    "lat": 27.923007,
    "region": "浙江·温州",
    "direction": "入口"
  },
  {
    "id": "toll-温州-30",
    "name": "塘下收费站(G15沈海高速入口)",
    "highway": "G15",
    "lng": 120.66461,
    "lat": 27.852877,
    "region": "浙江·温州",
    "direction": "入口"
  },
  {
    "id": "toll-温州-33",
    "name": "梅岙收费站(G1513温丽高速出口)",
    "highway": "G1513",
    "lng": 120.569459,
    "lat": 28.115108,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-34",
    "name": "七里港收费站(S10温州绕城高速入口)",
    "highway": "S10",
    "lng": 120.881674,
    "lat": 28.010635,
    "region": "浙江·温州",
    "direction": "入口"
  },
  {
    "id": "toll-温州-36",
    "name": "机场西收费站(S40龙湾联络线入口)",
    "highway": "S40",
    "lng": 120.810208,
    "lat": 27.898839,
    "region": "浙江·温州",
    "direction": "入口"
  },
  {
    "id": "toll-温州-37",
    "name": "灵昆收费站(G1523甬莞高速出口)",
    "highway": "G1523",
    "lng": 120.899791,
    "lat": 27.946713,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-38",
    "name": "金海湖收费站(G1523甬莞高速出口)",
    "highway": "G1523",
    "lng": 120.791025,
    "lat": 27.822608,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-39",
    "name": "机场收费站(G1523甬莞高速出口)",
    "highway": "G1523",
    "lng": 120.838688,
    "lat": 27.862202,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-40",
    "name": "瑞安收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 120.631679,
    "lat": 27.802185,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-41",
    "name": "柳市收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 120.878605,
    "lat": 28.06499,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-43",
    "name": "永嘉收费站(S26诸永高速出口)",
    "highway": "S26",
    "lng": 120.747673,
    "lat": 28.160022,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-46",
    "name": "黄华收费站(S10温州绕城高速出口)",
    "highway": "S10",
    "lng": 120.951055,
    "lat": 28.008588,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-48",
    "name": "陶山收费站(S10温州绕城高速出口)",
    "highway": "S10",
    "lng": 120.525665,
    "lat": 27.853936,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-49",
    "name": "飞云收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 120.595338,
    "lat": 27.78275,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-51",
    "name": "桥头收费站(G1513温丽高速出口)",
    "highway": "G1513",
    "lng": 120.48199,
    "lat": 28.150424,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-54",
    "name": "乐清收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 120.964895,
    "lat": 28.086882,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-55",
    "name": "瑞安东收费站(G1523甬莞高速入口)",
    "highway": "G1523",
    "lng": 120.735265,
    "lat": 27.753473,
    "region": "浙江·温州",
    "direction": "入口"
  },
  {
    "id": "toll-温州-60",
    "name": "万全收费站(S10温州绕城高速入口)",
    "highway": "S10",
    "lng": 120.547504,
    "lat": 27.750846,
    "region": "浙江·温州",
    "direction": "入口"
  },
  {
    "id": "toll-温州-62",
    "name": "阁巷收费站(S10温州绕城高速出口)",
    "highway": "S10",
    "lng": 120.633654,
    "lat": 27.702456,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-65",
    "name": "乐清北收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 121.007815,
    "lat": 28.128345,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-66",
    "name": "荆谷收费站(S10温州绕城高速入口)",
    "highway": "S10",
    "lng": 120.496084,
    "lat": 27.785588,
    "region": "浙江·温州",
    "direction": "入口"
  },
  {
    "id": "toll-温州-69",
    "name": "乌牛收费站(S10温州绕城高速出口)",
    "highway": "S10",
    "lng": 120.794385,
    "lat": 28.052394,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-70",
    "name": "瑞安东收费站(G1523甬莞高速出口)",
    "highway": "G1523",
    "lng": 120.73317,
    "lat": 27.750565,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-71",
    "name": "平阳收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 120.546043,
    "lat": 27.675982,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-温州-74",
    "name": "蒲岐收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 121.046694,
    "lat": 28.171185,
    "region": "浙江·温州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-1",
    "name": "南太湖收费站(G50沪渝高速入口)",
    "highway": "G50",
    "lng": 120.073591,
    "lat": 30.932318,
    "region": "浙江·湖州",
    "direction": "入口"
  },
  {
    "id": "toll-湖州-3",
    "name": "湖州北收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 120.026522,
    "lat": 30.900066,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-5",
    "name": "湖州收费站(G50沪渝高速出口)",
    "highway": "G50",
    "lng": 120.157718,
    "lat": 30.913749,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-7",
    "name": "湖州南收费站(G25长深高速入口)",
    "highway": "G25",
    "lng": 120.066068,
    "lat": 30.816946,
    "region": "浙江·湖州",
    "direction": "入口"
  },
  {
    "id": "toll-湖州-9",
    "name": "湖州东收费站(S12申嘉湖高速入口)",
    "highway": "S12",
    "lng": 120.163695,
    "lat": 30.804625,
    "region": "浙江·湖州",
    "direction": "入口"
  },
  {
    "id": "toll-湖州-11",
    "name": "妙西收费站(S12申嘉湖高速入口)",
    "highway": "S12",
    "lng": 119.966173,
    "lat": 30.80894,
    "region": "浙江·湖州",
    "direction": "入口"
  },
  {
    "id": "toll-湖州-12",
    "name": "长兴南收费站(G25长深高速入口)",
    "highway": "G25",
    "lng": 119.947568,
    "lat": 30.988329,
    "region": "浙江·湖州",
    "direction": "入口"
  },
  {
    "id": "toll-湖州-15",
    "name": "织里收费站(G50沪渝高速出口)",
    "highway": "G50",
    "lng": 120.272911,
    "lat": 30.889866,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-16",
    "name": "长兴收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 119.943827,
    "lat": 31.027908,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-18",
    "name": "青山收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 120.052038,
    "lat": 30.695627,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-20",
    "name": "和平收费站(S12申嘉湖高速出口)",
    "highway": "S12",
    "lng": 119.889207,
    "lat": 30.803116,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-21",
    "name": "长兴西收费站(G50沪渝高速出口)",
    "highway": "G50",
    "lng": 119.849528,
    "lat": 30.971969,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-24",
    "name": "长兴北收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 119.937529,
    "lat": 31.110919,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-26",
    "name": "南浔收费站(G50沪渝高速出口)",
    "highway": "G50",
    "lng": 120.38017,
    "lat": 30.884808,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-28",
    "name": "梅溪收费站(S12申嘉湖高速出口)",
    "highway": "S12",
    "lng": 119.802121,
    "lat": 30.776858,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-29",
    "name": "南浔西收费站(S47湖杭高速入口)",
    "highway": "S47",
    "lng": 120.298153,
    "lat": 30.815748,
    "region": "浙江·湖州",
    "direction": "入口"
  },
  {
    "id": "toll-湖州-30",
    "name": "双林收费站(S12申嘉湖高速出口)",
    "highway": "S12",
    "lng": 120.338946,
    "lat": 30.757274,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-31",
    "name": "德清北收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 120.058007,
    "lat": 30.624179,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-32",
    "name": "林城收费站(G50沪渝高速出口)",
    "highway": "G50",
    "lng": 119.770105,
    "lat": 30.943402,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-37",
    "name": "南浔南收费站(S12申嘉湖高速出口)",
    "highway": "S12",
    "lng": 120.40042,
    "lat": 30.741231,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-38",
    "name": "菱湖收费站(S47湖杭高速出口)",
    "highway": "S47",
    "lng": 120.218581,
    "lat": 30.704841,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-39",
    "name": "乾元收费站(S43杭州绕城西复线出口)",
    "highway": "S43",
    "lng": 120.091795,
    "lat": 30.574677,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-41",
    "name": "阜溪收费站(S43杭州绕城西复线出口)",
    "highway": "S43",
    "lng": 119.951522,
    "lat": 30.58654,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-42",
    "name": "钟管收费站(S43杭州绕城西复线出口)",
    "highway": "S43",
    "lng": 120.153509,
    "lat": 30.588026,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-45",
    "name": "织里东收费站(S47湖杭高速出口织里东方向)",
    "highway": "S47",
    "lng": 120.302329,
    "lat": 30.867422,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-46",
    "name": "新市西收费站(S43杭州绕城西复线出口)",
    "highway": "S43",
    "lng": 120.248614,
    "lat": 30.596157,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-48",
    "name": "德清收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 120.01531,
    "lat": 30.54511,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-49",
    "name": "天子湖收费站(S14杭长宜高速出口)",
    "highway": "S14",
    "lng": 119.688519,
    "lat": 30.830342,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-50",
    "name": "德清收费站(G25长深高速入口)",
    "highway": "G25",
    "lng": 120.015148,
    "lat": 30.54498,
    "region": "浙江·湖州",
    "direction": "入口"
  },
  {
    "id": "toll-湖州-51",
    "name": "新安收费站(S13练杭高速出口)",
    "highway": "S13",
    "lng": 120.210601,
    "lat": 30.540182,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-52",
    "name": "安吉北收费站(S14杭长宜高速出口)",
    "highway": "S14",
    "lng": 119.678398,
    "lat": 30.755165,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-53",
    "name": "练市收费站(S13练杭高速入口)",
    "highway": "S13",
    "lng": 120.414007,
    "lat": 30.692292,
    "region": "浙江·湖州",
    "direction": "入口"
  },
  {
    "id": "toll-湖州-54",
    "name": "泗安收费站(G50沪渝高速入口)",
    "highway": "G50",
    "lng": 119.643308,
    "lat": 30.910037,
    "region": "浙江·湖州",
    "direction": "入口"
  },
  {
    "id": "toll-湖州-56",
    "name": "千金收费站(S47湖杭高速出口)",
    "highway": "S47",
    "lng": 120.227191,
    "lat": 30.647186,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-58",
    "name": "莫干山收费站(S43杭州绕城西复线出口)",
    "highway": "S43",
    "lng": 119.90456,
    "lat": 30.545276,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-59",
    "name": "安吉北收费站(S14杭长宜高速入口)",
    "highway": "S14",
    "lng": 119.678397,
    "lat": 30.754996,
    "region": "浙江·湖州",
    "direction": "入口"
  },
  {
    "id": "toll-湖州-60",
    "name": "安吉开发区收费站(S14杭长宜高速出口)",
    "highway": "S14",
    "lng": 119.722793,
    "lat": 30.656876,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-62",
    "name": "莫干山高新区收费站(S43杭州绕城西复线入口)",
    "highway": "S43",
    "lng": 120.012086,
    "lat": 30.579566,
    "region": "浙江·湖州",
    "direction": "入口"
  },
  {
    "id": "toll-湖州-64",
    "name": "新市收费站(S13练杭高速出口)",
    "highway": "S13",
    "lng": 120.260518,
    "lat": 30.566031,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-66",
    "name": "下舍收费站(S47湖杭高速出口)",
    "highway": "S47",
    "lng": 120.191017,
    "lat": 30.56674,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-67",
    "name": "雷甸收费站(S13练杭高速出口)",
    "highway": "S13",
    "lng": 120.169425,
    "lat": 30.496079,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-68",
    "name": "泗安北收费站(S14杭长宜高速出口)",
    "highway": "S14",
    "lng": 119.666691,
    "lat": 30.949816,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-湖州-70",
    "name": "安吉收费站(S14杭长宜高速入口)",
    "highway": "S14",
    "lng": 119.725061,
    "lat": 30.621243,
    "region": "浙江·湖州",
    "direction": "入口"
  },
  {
    "id": "toll-湖州-71",
    "name": "煤山北收费站(S14杭长高速出口)",
    "highway": "S14",
    "lng": 119.677787,
    "lat": 31.124925,
    "region": "浙江·湖州",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-1",
    "name": "镜湖收费站(绿云高架路出口)",
    "highway": "高速公路",
    "lng": 120.522487,
    "lat": 30.079036,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-2",
    "name": "绍兴收费站(G92杭州湾环线高速出口)",
    "highway": "G92",
    "lng": 120.608838,
    "lat": 30.110106,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-4",
    "name": "齐贤收费站(S9苏台高速出口齐贤方向)",
    "highway": "S9",
    "lng": 120.549554,
    "lat": 30.11937,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-5",
    "name": "柯岩收费站(S9苏台高速出口)",
    "highway": "S9",
    "lng": 120.501033,
    "lat": 30.027934,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-8",
    "name": "孙端收费站(G92杭州湾环线高速出口)",
    "highway": "G92",
    "lng": 120.691529,
    "lat": 30.080671,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-9",
    "name": "柯桥收费站(G92杭州湾环线高速入口)",
    "highway": "G92",
    "lng": 120.519813,
    "lat": 30.149771,
    "region": "浙江·绍兴",
    "direction": "入口"
  },
  {
    "id": "toll-绍兴-11",
    "name": "福全收费站(S9苏台高速出口)",
    "highway": "S9",
    "lng": 120.489999,
    "lat": 29.981328,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-12",
    "name": "绍兴南收费站(S24绍诸高速出口)",
    "highway": "S24",
    "lng": 120.565985,
    "lat": 29.927455,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-13",
    "name": "柯桥收费站(G92杭州湾环线高速出口)",
    "highway": "G92",
    "lng": 120.525976,
    "lat": 30.155244,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-14",
    "name": "兰亭收费站(S24绍诸高速出口)",
    "highway": "S24",
    "lng": 120.507476,
    "lat": 29.915011,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-17",
    "name": "平水收费站(S24绍诸高速出口)",
    "highway": "S24",
    "lng": 120.637433,
    "lat": 29.935911,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-18",
    "name": "滨海新城南(沥海)收费站(G1522常台高速出口)",
    "highway": "G1522",
    "lng": 120.774627,
    "lat": 30.115301,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-19",
    "name": "上虞道墟收费站(G1522常台高速出口)",
    "highway": "G1522",
    "lng": 120.790983,
    "lat": 30.038808,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-21",
    "name": "富盛收费站(S24绍诸高速出口)",
    "highway": "S24",
    "lng": 120.709085,
    "lat": 29.971176,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-23",
    "name": "东关收费站(G1522常台高速出口东关方向)",
    "highway": "G1522",
    "lng": 120.80312,
    "lat": 30.010375,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-25",
    "name": "马鞍收费站(G9221杭绍甬高速出口)",
    "highway": "G9221",
    "lng": 120.662007,
    "lat": 30.194452,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-26",
    "name": "兰亭收费站(S24绍诸高速入口)",
    "highway": "S24",
    "lng": 120.507412,
    "lat": 29.914861,
    "region": "浙江·绍兴",
    "direction": "入口"
  },
  {
    "id": "toll-绍兴-28",
    "name": "滨海新城北收费站(G1522常台高速出口)",
    "highway": "G1522",
    "lng": 120.773135,
    "lat": 30.20182,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-30",
    "name": "蒿坝收费站(G1522常台高速出口)",
    "highway": "G1522",
    "lng": 120.84379,
    "lat": 29.978037,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-33",
    "name": "柯桥西(杨汛桥)收费站(G60沪昆高速出口)",
    "highway": "G60",
    "lng": 120.305888,
    "lat": 30.131232,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-35",
    "name": "绍兴高新区收费站(S24绍诸高速出口)",
    "highway": "S24",
    "lng": 120.740626,
    "lat": 30.004471,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-37",
    "name": "绍兴北收费站(G9221杭绍甬高速出口)",
    "highway": "G9221",
    "lng": 120.704996,
    "lat": 30.16856,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-39",
    "name": "上虞收费站(G92杭州湾环线高速出口宁波方向)",
    "highway": "G92",
    "lng": 120.896095,
    "lat": 30.050989,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-41",
    "name": "湖塘收费站(S42柯桥联络线出口)",
    "highway": "S42",
    "lng": 120.439969,
    "lat": 30.036319,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-42",
    "name": "枫桥北收费站(S24绍诸高速出口)",
    "highway": "S24",
    "lng": 120.446947,
    "lat": 29.811463,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-43",
    "name": "上浦收费站(G1522常台高速出口)",
    "highway": "G1522",
    "lng": 120.829359,
    "lat": 29.898714,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-46",
    "name": "平水南收费站(S9苏台高速入口)",
    "highway": "S9",
    "lng": 120.578385,
    "lat": 29.854361,
    "region": "浙江·绍兴",
    "direction": "入口"
  },
  {
    "id": "toll-绍兴-51",
    "name": "盖北收费站(G9221杭绍甬高速出口)",
    "highway": "G9221",
    "lng": 120.876454,
    "lat": 30.170819,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-52",
    "name": "枫桥南收费站(S24绍诸高速出口)",
    "highway": "S24",
    "lng": 120.393384,
    "lat": 29.764648,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-54",
    "name": "福全西(漓渚)收费站(G9903杭州都市圈环线出口)",
    "highway": "G9903",
    "lng": 120.463064,
    "lat": 29.999564,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-56",
    "name": "崧厦收费站(G9221杭绍甬高速出口)",
    "highway": "G9221",
    "lng": 120.828699,
    "lat": 30.169295,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-57",
    "name": "钱清(夏履)收费站(S42柯桥联络线出口)",
    "highway": "S42",
    "lng": 120.386349,
    "lat": 30.086952,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-59",
    "name": "章镇收费站(G1522常台高速出口)",
    "highway": "G1522",
    "lng": 120.842976,
    "lat": 29.820883,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-60",
    "name": "次坞收费站(G60沪昆高速出口)",
    "highway": "G60",
    "lng": 120.208159,
    "lat": 29.89712,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-62",
    "name": "牟山收费站(G92杭州湾环线高速出口宁波方向)",
    "highway": "G92",
    "lng": 120.979132,
    "lat": 30.062746,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-63",
    "name": "稽东王坛收费站(S9苏台高速出口)",
    "highway": "S9",
    "lng": 120.603463,
    "lat": 29.805894,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-64",
    "name": "店口收费站(G9903杭州都市圈环线入口)",
    "highway": "G9903",
    "lng": 120.331661,
    "lat": 29.905932,
    "region": "浙江·绍兴",
    "direction": "入口"
  },
  {
    "id": "toll-绍兴-66",
    "name": "直埠收费站(S26诸永高速出口)",
    "highway": "S26",
    "lng": 120.233996,
    "lat": 29.820827,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-67",
    "name": "诸暨浣东收费站(S24绍诸高速出口)",
    "highway": "S24",
    "lng": 120.293764,
    "lat": 29.749212,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-72",
    "name": "三界收费站(G1522常台高速出口)",
    "highway": "G1522",
    "lng": 120.838398,
    "lat": 29.752548,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-73",
    "name": "诸暨东收费站(S26诸永高速出口)",
    "highway": "S26",
    "lng": 120.303666,
    "lat": 29.720413,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-绍兴-75",
    "name": "诸暨北收费站(S26诸永高速出口)",
    "highway": "S26",
    "lng": 120.276655,
    "lat": 29.788902,
    "region": "浙江·绍兴",
    "direction": "出口"
  },
  {
    "id": "toll-衢州-1",
    "name": "衢州西收费站(G60沪昆高速出口)",
    "highway": "G60",
    "lng": 118.830342,
    "lat": 28.983661,
    "region": "浙江·衢州",
    "direction": "出口"
  },
  {
    "id": "toll-衢州-4",
    "name": "衢州东收费站(G60沪昆高速出口)",
    "highway": "G60",
    "lng": 118.928419,
    "lat": 29.002295,
    "region": "浙江·衢州",
    "direction": "出口"
  },
  {
    "id": "toll-衢州-6",
    "name": "柯城收费站(G60沪昆高速入口)",
    "highway": "G60",
    "lng": 118.768596,
    "lat": 28.968541,
    "region": "浙江·衢州",
    "direction": "入口"
  },
  {
    "id": "toll-衢州-8",
    "name": "G3衢州南收费站(G3京台高速出口)",
    "highway": "G3",
    "lng": 118.721381,
    "lat": 28.870163,
    "region": "浙江·衢州",
    "direction": "出口"
  },
  {
    "id": "toll-衢州-9",
    "name": "东案收费站(G3京台高速入口)",
    "highway": "G3",
    "lng": 118.643217,
    "lat": 28.980288,
    "region": "浙江·衢州",
    "direction": "入口"
  },
  {
    "id": "toll-衢州-12",
    "name": "衢江收费站(G60沪昆高速出口)",
    "highway": "G60",
    "lng": 119.011846,
    "lat": 29.02497,
    "region": "浙江·衢州",
    "direction": "出口"
  },
  {
    "id": "toll-衢州-13",
    "name": "常山东收费站(G60沪昆高速入口)",
    "highway": "G60",
    "lng": 118.610243,
    "lat": 28.94028,
    "region": "浙江·衢州",
    "direction": "入口"
  },
  {
    "id": "toll-衢州-15",
    "name": "龙游南收费站(G4012溧宁高速出口)",
    "highway": "G4012",
    "lng": 119.138739,
    "lat": 28.98477,
    "region": "浙江·衢州",
    "direction": "出口"
  },
  {
    "id": "toll-衢州-17",
    "name": "新桥收费站(G6021杭长高速出口)",
    "highway": "G6021",
    "lng": 118.729288,
    "lat": 29.171802,
    "region": "浙江·衢州",
    "direction": "出口"
  },
  {
    "id": "toll-衢州-18",
    "name": "G3江山收费站(G3京台高速出口)",
    "highway": "G3",
    "lng": 118.670588,
    "lat": 28.758886,
    "region": "浙江·衢州",
    "direction": "出口"
  },
  {
    "id": "toll-衢州-19",
    "name": "衢江收费站(G60沪昆高速入口)",
    "highway": "G60",
    "lng": 119.011777,
    "lat": 29.025069,
    "region": "浙江·衢州",
    "direction": "入口"
  },
  {
    "id": "toll-衢州-20",
    "name": "龙游收费站(G60沪昆高速出口)",
    "highway": "G60",
    "lng": 119.176612,
    "lat": 29.079838,
    "region": "浙江·衢州",
    "direction": "出口"
  },
  {
    "id": "toll-衢州-22",
    "name": "龙游北收费站(G4012溧宁高速出口)",
    "highway": "G4012",
    "lng": 119.144496,
    "lat": 29.141966,
    "region": "浙江·衢州",
    "direction": "出口"
  },
  {
    "id": "toll-衢州-23",
    "name": "芳村收费站(G3京台高速出口)",
    "highway": "G3",
    "lng": 118.586862,
    "lat": 29.03819,
    "region": "浙江·衢州",
    "direction": "出口"
  },
  {
    "id": "toll-衢州-24",
    "name": "常山收费站(G60沪昆高速出口)",
    "highway": "G60",
    "lng": 118.502331,
    "lat": 28.925081,
    "region": "浙江·衢州",
    "direction": "出口"
  },
  {
    "id": "toll-衢州-28",
    "name": "上方收费站(G6021杭长高速出口)",
    "highway": "G6021",
    "lng": 118.943355,
    "lat": 29.232224,
    "region": "浙江·衢州",
    "direction": "出口"
  },
  {
    "id": "toll-衢州-29",
    "name": "灵溪收费站(G4012溧宁高速出口)",
    "highway": "G4012",
    "lng": 119.165896,
    "lat": 28.854836,
    "region": "浙江·衢州",
    "direction": "出口"
  },
  {
    "id": "toll-衢州-30",
    "name": "龙游港收费站(G60沪昆高速出口)",
    "highway": "G60",
    "lng": 119.25365,
    "lat": 29.088884,
    "region": "浙江·衢州",
    "direction": "出口"
  },
  {
    "id": "toll-衢州-31",
    "name": "太真收费站(G6021杭长高速出口)",
    "highway": "G6021",
    "lng": 118.83247,
    "lat": 29.183003,
    "region": "浙江·衢州",
    "direction": "出口"
  },
  {
    "id": "toll-衢州-32",
    "name": "开化收费站(G3京台高速出口)",
    "highway": "G3",
    "lng": 118.41949,
    "lat": 29.149883,
    "region": "浙江·衢州",
    "direction": "出口"
  },
  {
    "id": "toll-衢州-33",
    "name": "开化南收费站(G6021杭长高速出口)",
    "highway": "G6021",
    "lng": 118.391702,
    "lat": 29.086681,
    "region": "浙江·衢州",
    "direction": "出口"
  },
  {
    "id": "toll-衢州-36",
    "name": "G3江郎山收费站(G3京台高速出口)",
    "highway": "G3",
    "lng": 118.589748,
    "lat": 28.609513,
    "region": "浙江·衢州",
    "direction": "出口"
  },
  {
    "id": "toll-衢州-39",
    "name": "林山收费站(G6021杭长高速出口)",
    "highway": "G6021",
    "lng": 118.484779,
    "lat": 29.125513,
    "region": "浙江·衢州",
    "direction": "出口"
  },
  {
    "id": "toll-衢州-42",
    "name": "常山西收费站(G60沪昆高速出口)",
    "highway": "G60",
    "lng": 118.361323,
    "lat": 28.826876,
    "region": "浙江·衢州",
    "direction": "出口"
  },
  {
    "id": "toll-衢州-46",
    "name": "马金收费站(G3京台高速出口)",
    "highway": "G3",
    "lng": 118.386021,
    "lat": 29.300523,
    "region": "浙江·衢州",
    "direction": "出口"
  },
  {
    "id": "toll-衢州-48",
    "name": "池淮收费站(G6021杭长高速出口)",
    "highway": "G6021",
    "lng": 118.283116,
    "lat": 29.097122,
    "region": "浙江·衢州",
    "direction": "出口"
  },
  {
    "id": "toll-衢州-50",
    "name": "G3峡口收费站(G3京台高速出口)",
    "highway": "G3",
    "lng": 118.532636,
    "lat": 28.460032,
    "region": "浙江·衢州",
    "direction": "出口"
  },
  {
    "id": "toll-衢州-54",
    "name": "杨林收费站(G6021杭长高速入口)",
    "highway": "G6021",
    "lng": 118.147269,
    "lat": 29.062478,
    "region": "浙江·衢州",
    "direction": "入口"
  },
  {
    "id": "toll-衢州-56",
    "name": "收费站(甬金衢上高速入口)",
    "highway": "甬金高速",
    "lng": 118.955382,
    "lat": 28.861659,
    "region": "浙江·衢州",
    "direction": "入口"
  },
  {
    "id": "toll-衢州-57",
    "name": "收费站(甬金衢上高速出口)",
    "highway": "甬金高速",
    "lng": 118.619639,
    "lat": 28.795837,
    "region": "浙江·衢州",
    "direction": "出口"
  },
  {
    "id": "toll-衢州-58",
    "name": "收费站(甬金衢上高速出口)",
    "highway": "甬金高速",
    "lng": 118.889435,
    "lat": 28.846391,
    "region": "浙江·衢州",
    "direction": "出口"
  },
  {
    "id": "toll-衢州-59",
    "name": "收费站(甬金衢上高速入口)",
    "highway": "甬金高速",
    "lng": 118.809495,
    "lat": 28.82839,
    "region": "浙江·衢州",
    "direction": "入口"
  },
  {
    "id": "toll-衢州-60",
    "name": "收费站(甬金衢上高速入口)",
    "highway": "甬金高速",
    "lng": 119.080803,
    "lat": 28.901491,
    "region": "浙江·衢州",
    "direction": "入口"
  },
  {
    "id": "toll-衢州-61",
    "name": "G3廿八都收费站(G3京台高速入口)",
    "highway": "G3",
    "lng": 118.47627,
    "lat": 28.301735,
    "region": "浙江·衢州",
    "direction": "入口"
  },
  {
    "id": "toll-衢州-63",
    "name": "钱江源景区收费站(G3京台高速出口黄山方向)",
    "highway": "G3",
    "lng": 118.306427,
    "lat": 29.418193,
    "region": "浙江·衢州",
    "direction": "出口"
  },
  {
    "id": "toll-衢州-64",
    "name": "钱江源国家公园收费站(G3京台高速入口开化方向)",
    "highway": "G3",
    "lng": 118.306441,
    "lat": 29.418117,
    "region": "浙江·衢州",
    "direction": "入口"
  },
  {
    "id": "toll-衢州-65",
    "name": "收费站(甬金衢上高速入口)",
    "highway": "甬金高速",
    "lng": 119.207021,
    "lat": 28.946476,
    "region": "浙江·衢州",
    "direction": "入口"
  },
  {
    "id": "toll-衢州-70",
    "name": "收费站(甬金衢上高速出口)",
    "highway": "甬金高速",
    "lng": 119.271325,
    "lat": 29.000149,
    "region": "浙江·衢州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-1",
    "name": "S28章安收费站(S28台金高速出口)",
    "highway": "S28",
    "lng": 121.404597,
    "lat": 28.742802,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-3",
    "name": "杜桥收费站(S28台金高速出口)",
    "highway": "S28",
    "lng": 121.477734,
    "lat": 28.734177,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-4",
    "name": "台州东收费站(G1523甬莞高速出口)",
    "highway": "G1523",
    "lng": 121.51281,
    "lat": 28.627944,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-6",
    "name": "头门港南收费站(G1523甬莞高速出口)",
    "highway": "G1523",
    "lng": 121.525817,
    "lat": 28.716947,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-7",
    "name": "S28沿江收费站(S38台州市区支线入口)",
    "highway": "S28",
    "lng": 121.29386,
    "lat": 28.736476,
    "region": "浙江·台州",
    "direction": "入口"
  },
  {
    "id": "toll-台州-9",
    "name": "路桥收费站(G1523甬莞高速出口)",
    "highway": "G1523",
    "lng": 121.535342,
    "lat": 28.559296,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-10",
    "name": "头门港收费站(G1523甬莞高速出口)",
    "highway": "G1523",
    "lng": 121.562039,
    "lat": 28.756767,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-12",
    "name": "台州收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 121.241387,
    "lat": 28.675055,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-13",
    "name": "S28涌泉收费站(S28台金高速出口)",
    "highway": "S28",
    "lng": 121.32909,
    "lat": 28.733635,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-14",
    "name": "临海南收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 121.238211,
    "lat": 28.78516,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-17",
    "name": "温岭北收费站(G1523甬莞高速入口)",
    "highway": "G1523",
    "lng": 121.559657,
    "lat": 28.465936,
    "region": "浙江·台州",
    "direction": "入口"
  },
  {
    "id": "toll-台州-18",
    "name": "温岭西收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 121.24594,
    "lat": 28.472431,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-23",
    "name": "台州南收费站(G15沈海高速出口台州方向)",
    "highway": "G15",
    "lng": 121.244259,
    "lat": 28.554531,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-24",
    "name": "泽国收费站(S39温岭联络线出口)",
    "highway": "S39",
    "lng": 121.32179,
    "lat": 28.462633,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-25",
    "name": "桃渚收费站(G1523甬莞高速出口)",
    "highway": "G1523",
    "lng": 121.580335,
    "lat": 28.83966,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-26",
    "name": "S28临海市区收费站(S28台金高速入口)",
    "highway": "S28",
    "lng": 121.140597,
    "lat": 28.803898,
    "region": "浙江·台州",
    "direction": "入口"
  },
  {
    "id": "toll-台州-27",
    "name": "温岭东收费站(太龙快速路出口)",
    "highway": "高速公路",
    "lng": 121.520016,
    "lat": 28.372228,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-29",
    "name": "临海北收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 121.220312,
    "lat": 28.92305,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-33",
    "name": "温岭城区收费站(S39温岭联络线出口)",
    "highway": "S39",
    "lng": 121.387519,
    "lat": 28.461894,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-36",
    "name": "浦坝港收费站(G1523甬莞高速出口)",
    "highway": "G1523",
    "lng": 121.603103,
    "lat": 28.960651,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-38",
    "name": "温岭南收费站(G1523甬莞高速出口)",
    "highway": "G1523",
    "lng": 121.408994,
    "lat": 28.297542,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-39",
    "name": "S28临海西收费站(S28台金高速入口)",
    "highway": "S28",
    "lng": 121.047927,
    "lat": 28.87581,
    "region": "浙江·台州",
    "direction": "入口"
  },
  {
    "id": "toll-台州-41",
    "name": "新河收费站(S39温岭联络线出口)",
    "highway": "S39",
    "lng": 121.433424,
    "lat": 28.458576,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-43",
    "name": "沙门收费站(G1523甬莞高速出口)",
    "highway": "G1523",
    "lng": 121.388129,
    "lat": 28.243248,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-45",
    "name": "三门西收费站(G15沈海高速入口)",
    "highway": "G15",
    "lng": 121.306752,
    "lat": 29.083638,
    "region": "浙江·台州",
    "direction": "入口"
  },
  {
    "id": "toll-台州-46",
    "name": "三门收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 121.306932,
    "lat": 29.083635,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-51",
    "name": "洋头收费站(G1522常台高速出口)",
    "highway": "G1522",
    "lng": 121.161324,
    "lat": 29.084062,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-53",
    "name": "芦浦收费站(G1523甬莞高速出口)",
    "highway": "G1523",
    "lng": 121.211909,
    "lat": 28.193564,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-55",
    "name": "玉环收费站(G1523甬莞高速出口)",
    "highway": "G1523",
    "lng": 121.263785,
    "lat": 28.176783,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-59",
    "name": "三门东收费站(G1523甬莞高速出口)",
    "highway": "G1523",
    "lng": 121.581809,
    "lat": 29.099697,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-61",
    "name": "S28白水洋收费站(S28台金高速出口)",
    "highway": "S28",
    "lng": 120.906444,
    "lat": 28.881491,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-62",
    "name": "双港收费站(S9苏台高速入口)",
    "highway": "S9",
    "lng": 120.930314,
    "lat": 28.945097,
    "region": "浙江·台州",
    "direction": "入口"
  },
  {
    "id": "toll-台州-63",
    "name": "括苍收费站(S9苏台高速出口)",
    "highway": "S9",
    "lng": 120.964078,
    "lat": 28.855336,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-65",
    "name": "海山收费站(G1523甬莞高速出口)",
    "highway": "G1523",
    "lng": 121.161358,
    "lat": 28.229531,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-66",
    "name": "三门城区收费站(S37三门联络线出口)",
    "highway": "S37",
    "lng": 121.365189,
    "lat": 29.072296,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-67",
    "name": "S28仙居东收费站(S28台金高速出口)",
    "highway": "S28",
    "lng": 120.852409,
    "lat": 28.871236,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-69",
    "name": "三门新城收费站(S37三门联络线出口)",
    "highway": "S37",
    "lng": 121.481989,
    "lat": 29.076339,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-70",
    "name": "蛇蟠收费站(G1523甬莞高速出口)",
    "highway": "G1523",
    "lng": 121.578161,
    "lat": 29.152237,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-71",
    "name": "新河收费站(S39温岭联络线出口)",
    "highway": "S39",
    "lng": 121.436749,
    "lat": 28.459969,
    "region": "浙江·台州",
    "direction": "出口"
  },
  {
    "id": "toll-台州-72",
    "name": "收费站(G15沈海高速入口)",
    "highway": "G15",
    "lng": 121.235546,
    "lat": 28.611196,
    "region": "浙江·台州",
    "direction": "入口"
  },
  {
    "id": "toll-上海-1",
    "name": "收费站(上海站)",
    "highway": "高速公路",
    "lng": 121.450385,
    "lat": 31.249385,
    "region": "上海",
    "direction": "出入口"
  },
  {
    "id": "toll-上海-2",
    "name": "东宝志明收费站",
    "highway": "高速公路",
    "lng": 121.471119,
    "lat": 31.265708,
    "region": "上海",
    "direction": "出入口"
  },
  {
    "id": "toll-上海-3",
    "name": "收费站(上海西站)",
    "highway": "高速公路",
    "lng": 121.395566,
    "lat": 31.263831,
    "region": "上海",
    "direction": "出入口"
  },
  {
    "id": "toll-上海-4",
    "name": "G2京沪高速江桥收费站(G2京沪高速西向)",
    "highway": "G2",
    "lng": 121.328315,
    "lat": 31.253665,
    "region": "上海",
    "direction": "出入口"
  },
  {
    "id": "toll-上海-6",
    "name": "G1503凌海路收费站(G1503上海绕城高速出口S20方向)",
    "highway": "G1503",
    "lng": 121.52791,
    "lat": 31.375137,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-上海-7",
    "name": "G50沪渝高速徐泾收费站(G50沪渝高速西向)",
    "highway": "G50",
    "lng": 121.308933,
    "lat": 31.161625,
    "region": "上海",
    "direction": "出入口"
  },
  {
    "id": "toll-上海-8",
    "name": "S4沪金高速颛桥收费站(S4沪金高速东南向)",
    "highway": "S4",
    "lng": 121.409958,
    "lat": 31.065783,
    "region": "上海",
    "direction": "出入口"
  },
  {
    "id": "toll-上海-9",
    "name": "G1503上海绕城高速高东收费站(G1503上海绕城高速东向)",
    "highway": "G1503",
    "lng": 121.662737,
    "lat": 31.307703,
    "region": "上海",
    "direction": "出入口"
  },
  {
    "id": "toll-上海-10",
    "name": "G15沪翔高速收费站(S6沪翔高速东向)",
    "highway": "G15",
    "lng": 121.261659,
    "lat": 31.318641,
    "region": "上海",
    "direction": "出入口"
  },
  {
    "id": "toll-上海-11",
    "name": "S2沪芦高速康桥收费站(S2沪芦高速北向)",
    "highway": "S2",
    "lng": 121.658804,
    "lat": 31.105418,
    "region": "上海",
    "direction": "出入口"
  },
  {
    "id": "toll-上海-12",
    "name": "G15曹安公路收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 121.236904,
    "lat": 31.272621,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-上海-13",
    "name": "G1503沪太公路收费站(G1503上海绕城高速出口)",
    "highway": "G1503",
    "lng": 121.351439,
    "lat": 31.384545,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-上海-14",
    "name": "S32林海公路收费站(S32申嘉湖高速入口)",
    "highway": "S32",
    "lng": 121.559854,
    "lat": 31.077806,
    "region": "上海",
    "direction": "入口"
  },
  {
    "id": "toll-上海-15",
    "name": "S26嘉松中路收费站(S26沪常高速出口嘉松中路方向)",
    "highway": "S26",
    "lng": 121.216404,
    "lat": 31.220224,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-上海-17",
    "name": "G60新桥收费站(G60沪昆高速出口)",
    "highway": "G60",
    "lng": 121.295258,
    "lat": 31.060565,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-上海-18",
    "name": "G60沪昆高速新桥主线收费站(G60沪昆高速西南向)",
    "highway": "G60",
    "lng": 121.310124,
    "lat": 31.07703,
    "region": "上海",
    "direction": "出入口"
  },
  {
    "id": "toll-上海-20",
    "name": "金海路收费站(G1503上海绕城高速出口)",
    "highway": "G1503",
    "lng": 121.695023,
    "lat": 31.278311,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-上海-21",
    "name": "S26沪常高速公路华新收费站(S26沪常高速西北向)",
    "highway": "S26",
    "lng": 121.251055,
    "lat": 31.218017,
    "region": "上海",
    "direction": "出入口"
  },
  {
    "id": "toll-上海-24",
    "name": "S32嘉闵高架路收费站(嘉闵高架路东南向)",
    "highway": "S32",
    "lng": 121.387781,
    "lat": 31.040109,
    "region": "上海",
    "direction": "出入口"
  },
  {
    "id": "toll-上海-25",
    "name": "G15莘砖公路收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 121.291318,
    "lat": 31.093863,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-上海-26",
    "name": "G1503蕰川路收费站(G1503上海绕城高速出口上海市区方向)",
    "highway": "G1503",
    "lng": 121.416492,
    "lat": 31.401386,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-上海-27",
    "name": "G1503沪崇高速收费站(S7沪崇高速出口G1503方向)",
    "highway": "G1503",
    "lng": 121.329669,
    "lat": 31.387126,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-上海-28",
    "name": "G1503嘉松北路收费站(G1503上海绕城高速入口东向)",
    "highway": "G1503",
    "lng": 121.187241,
    "lat": 31.337089,
    "region": "上海",
    "direction": "入口"
  },
  {
    "id": "toll-上海-29",
    "name": "G60松江东收费站(G60沪昆高速出口)",
    "highway": "G60",
    "lng": 121.259903,
    "lat": 31.040239,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-上海-30",
    "name": "G1503浏翔公路收费站(G1503上海绕城高速入口东向)",
    "highway": "G1503",
    "lng": 121.30322,
    "lat": 31.371722,
    "region": "上海",
    "direction": "入口"
  },
  {
    "id": "toll-上海-31",
    "name": "G2嘉松公路收费站(G2京沪高速入口东向)",
    "highway": "G2",
    "lng": 121.208825,
    "lat": 31.252039,
    "region": "上海",
    "direction": "入口"
  },
  {
    "id": "toll-上海-32",
    "name": "G15宝安公路收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 121.246659,
    "lat": 31.320543,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-上海-35",
    "name": "G15北青公路收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 121.260945,
    "lat": 31.201653,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-上海-36",
    "name": "G15嘉西收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 121.201989,
    "lat": 31.377053,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-上海-37",
    "name": "G50嘉松中路收费站(G50沪渝高速入口)",
    "highway": "G50",
    "lng": 121.224945,
    "lat": 31.150813,
    "region": "上海",
    "direction": "入口"
  },
  {
    "id": "toll-上海-38",
    "name": "S4剑川路收费站(S4沪金高速出口剑川路方向)",
    "highway": "S4",
    "lng": 121.426638,
    "lat": 31.030669,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-上海-39",
    "name": "G40长兴岛收费站(G40沪陕高速出口)",
    "highway": "G40",
    "lng": 121.710811,
    "lat": 31.391221,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-上海-40",
    "name": "S4大叶公路收费站(S4沪金高速出口)",
    "highway": "S4",
    "lng": 121.458601,
    "lat": 30.97259,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-上海-42",
    "name": "G1503重固收费站(G1503上海绕城高速入口)",
    "highway": "G1503",
    "lng": 121.144341,
    "lat": 31.186884,
    "region": "上海",
    "direction": "入口"
  },
  {
    "id": "toll-上海-43",
    "name": "G1503白鹤收费站(G1503上海绕城高速出口)",
    "highway": "G1503",
    "lng": 121.136789,
    "lat": 31.246404,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-上海-47",
    "name": "G1503宝安公路收费站(G1503上海绕城高速入口)",
    "highway": "G1503",
    "lng": 121.147625,
    "lat": 31.318446,
    "region": "上海",
    "direction": "入口"
  },
  {
    "id": "toll-上海-48",
    "name": "G50嘉松中路收费站(G50沪渝高速出口)",
    "highway": "G50",
    "lng": 121.225115,
    "lat": 31.150983,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-上海-49",
    "name": "机场大道(1)收费站(G1503上海绕城高速出口)",
    "highway": "G1503",
    "lng": 121.763223,
    "lat": 31.168019,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-上海-54",
    "name": "S2沪南公路收费站(S2沪芦高速出口)",
    "highway": "S2",
    "lng": 121.663699,
    "lat": 31.03583,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-上海-55",
    "name": "G15朱桥收费站(G15沈海高速出口朱桥方向)",
    "highway": "G15",
    "lng": 121.185361,
    "lat": 31.407621,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-上海-57",
    "name": "S32南六公路收费站(S32申嘉湖高速出口)",
    "highway": "S32",
    "lng": 121.702469,
    "lat": 31.090959,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-上海-58",
    "name": "G15朱桥收费站(G15沈海高速入口)",
    "highway": "G15",
    "lng": 121.18233,
    "lat": 31.405801,
    "region": "上海",
    "direction": "入口"
  },
  {
    "id": "toll-上海-60",
    "name": "G15沪松公路收费站(G15沈海高速出口沪松公路方向)",
    "highway": "G15",
    "lng": 121.299932,
    "lat": 31.133233,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-上海-61",
    "name": "S32申嘉湖高速祝桥收费站(S32申嘉湖高速东向)",
    "highway": "S32",
    "lng": 121.790585,
    "lat": 31.101376,
    "region": "上海",
    "direction": "出入口"
  },
  {
    "id": "toll-上海-62",
    "name": "G15车亭公路收费站(G15沈海高速出口车亭公路方向)",
    "highway": "G15",
    "lng": 121.294061,
    "lat": 30.996099,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-上海-64",
    "name": "G2安亭汽车城收费站(G2京沪高速出口)",
    "highway": "G2",
    "lng": 121.16025,
    "lat": 31.272458,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-上海-67",
    "name": "G1503沪崇高速收费站(S7沪崇高速入口南向)",
    "highway": "G1503",
    "lng": 121.331281,
    "lat": 31.368924,
    "region": "上海",
    "direction": "入口"
  },
  {
    "id": "toll-上海-69",
    "name": "S32松卫北路收费站(S32申嘉湖高速入口)",
    "highway": "S32",
    "lng": 121.257519,
    "lat": 30.98399,
    "region": "上海",
    "direction": "入口"
  },
  {
    "id": "toll-上海-70",
    "name": "S26重固收费站(S26沪常高速出口)",
    "highway": "S26",
    "lng": 121.174758,
    "lat": 31.213778,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-上海-73",
    "name": "G15华徐公路收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 121.234311,
    "lat": 31.222231,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-上海-75",
    "name": "S26香花桥收费站(S26沪常高速出口)",
    "highway": "S26",
    "lng": 121.088333,
    "lat": 31.225394,
    "region": "上海",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-1",
    "name": "马家浜收费站(G1522常台高速入口)",
    "highway": "G1522",
    "lng": 120.702619,
    "lat": 30.718783,
    "region": "浙江·嘉兴",
    "direction": "入口"
  },
  {
    "id": "toll-嘉兴-3",
    "name": "秀洲(嘉兴西)收费站(G1522常台高速出口苏州方向)",
    "highway": "G1522",
    "lng": 120.679226,
    "lat": 30.755655,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-4",
    "name": "南湖嘉兴南收费站(G1522常台高速入口)",
    "highway": "G1522",
    "lng": 120.757676,
    "lat": 30.685504,
    "region": "浙江·嘉兴",
    "direction": "入口"
  },
  {
    "id": "toll-嘉兴-7",
    "name": "秀洲(嘉兴西)收费站(G1522常台高速出口秀洲方向)",
    "highway": "G1522",
    "lng": 120.672555,
    "lat": 30.756947,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-9",
    "name": "王江泾(嘉兴北)收费站(S12申嘉湖高速入口)",
    "highway": "S12",
    "lng": 120.707845,
    "lat": 30.834336,
    "region": "浙江·嘉兴",
    "direction": "入口"
  },
  {
    "id": "toll-嘉兴-10",
    "name": "嘉兴东收费站(G60沪昆高速出口)",
    "highway": "G60",
    "lng": 120.861616,
    "lat": 30.743374,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-11",
    "name": "王店收费站(G60沪昆高速出口王店方向)",
    "highway": "G60",
    "lng": 120.705487,
    "lat": 30.64529,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-12",
    "name": "罗星收费站(G1521常嘉高速出口)",
    "highway": "G1521",
    "lng": 120.868273,
    "lat": 30.812347,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-13",
    "name": "余新收费站(S11乍嘉苏高速出口)",
    "highway": "S11",
    "lng": 120.808247,
    "lat": 30.657879,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-15",
    "name": "油车港收费站(S12申嘉湖高速出口)",
    "highway": "S12",
    "lng": 120.755467,
    "lat": 30.854001,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-18",
    "name": "王店东收费站(G1522常台高速出口)",
    "highway": "G1522",
    "lng": 120.741753,
    "lat": 30.614177,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-20",
    "name": "新塍收费站(S12申嘉湖高速出口)",
    "highway": "S12",
    "lng": 120.59255,
    "lat": 30.817111,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-21",
    "name": "王店收费站(G60沪昆高速入口上海方向)",
    "highway": "G60",
    "lng": 120.706131,
    "lat": 30.640958,
    "region": "浙江·嘉兴",
    "direction": "入口"
  },
  {
    "id": "toll-嘉兴-22",
    "name": "天凝收费站(S12申嘉湖高速出口)",
    "highway": "S12",
    "lng": 120.843638,
    "lat": 30.884155,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-23",
    "name": "濮院收费站(S12申嘉湖高速出口)",
    "highway": "S12",
    "lng": 120.543732,
    "lat": 30.74149,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-25",
    "name": "嘉善收费站(G60沪昆高速出口上海方向)",
    "highway": "G60",
    "lng": 120.947323,
    "lat": 30.798033,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-27",
    "name": "屠甸收费站(G60沪昆高速出口屠甸方向)",
    "highway": "G60",
    "lng": 120.628807,
    "lat": 30.580599,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-28",
    "name": "百步收费站(G1522常台高速出口)",
    "highway": "G1522",
    "lng": 120.754229,
    "lat": 30.558293,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-29",
    "name": "嘉善北收费站(G1521常嘉高速出口)",
    "highway": "G1521",
    "lng": 120.829824,
    "lat": 30.942581,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-30",
    "name": "乌镇收费站(S12申嘉湖高速出口)",
    "highway": "S12",
    "lng": 120.502283,
    "lat": 30.714975,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-33",
    "name": "西塘收费站(S12申嘉湖高速出口)",
    "highway": "S12",
    "lng": 120.901189,
    "lat": 30.920891,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-34",
    "name": "平湖收费站(G92杭州湾环线高速出口)",
    "highway": "G92",
    "lng": 120.977714,
    "lat": 30.680013,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-40",
    "name": "凤桥收费站(S11乍嘉苏高速出口)",
    "highway": "S11",
    "lng": 120.924661,
    "lat": 30.635605,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-45",
    "name": "硖石收费站(G1522常台高速出口)",
    "highway": "G1522",
    "lng": 120.756917,
    "lat": 30.489551,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-46",
    "name": "姚庄收费站(S12申嘉湖高速出口)",
    "highway": "S12",
    "lng": 120.971943,
    "lat": 30.936449,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-48",
    "name": "嘉兴港区收费站(G15沈海高速入口)",
    "highway": "G15",
    "lng": 121.021114,
    "lat": 30.606815,
    "region": "浙江·嘉兴",
    "direction": "入口"
  },
  {
    "id": "toll-嘉兴-50",
    "name": "海盐收费站(G92杭州湾环线高速出口)",
    "highway": "G92",
    "lng": 120.933651,
    "lat": 30.578134,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-51",
    "name": "乍浦(平湖南)收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 121.040233,
    "lat": 30.647858,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-55",
    "name": "桐乡收费站(G60沪昆高速出口桐乡方向)",
    "highway": "G60",
    "lng": 120.547914,
    "lat": 30.535881,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-59",
    "name": "海宁南收费站(G92杭州湾环线高速出口)",
    "highway": "G92",
    "lng": 120.671904,
    "lat": 30.422677,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-60",
    "name": "独山港西收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 121.144503,
    "lat": 30.687299,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-61",
    "name": "乌镇南收费站(S9苏台高速出口)",
    "highway": "S9",
    "lng": 120.469815,
    "lat": 30.657651,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-62",
    "name": "周王庙收费站(S9苏台高速出口)",
    "highway": "S9",
    "lng": 120.516385,
    "lat": 30.468325,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-63",
    "name": "袁花收费站(G1522常台高速出口)",
    "highway": "G1522",
    "lng": 120.786358,
    "lat": 30.402543,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-68",
    "name": "桐乡收费站(G60沪昆高速出口上海方向)",
    "highway": "G60",
    "lng": 120.54054,
    "lat": 30.530096,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-71",
    "name": "梧桐收费站(S9苏台高速出口)",
    "highway": "S9",
    "lng": 120.476927,
    "lat": 30.602921,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-72",
    "name": "桐乡西收费站(S13练杭高速出口)",
    "highway": "S13",
    "lng": 120.333269,
    "lat": 30.617019,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-73",
    "name": "南北湖收费站(杭浦高速东向)",
    "highway": "高速公路",
    "lng": 120.872908,
    "lat": 30.505466,
    "region": "浙江·嘉兴",
    "direction": "出入口"
  },
  {
    "id": "toll-嘉兴-76",
    "name": "长安收费站(G60沪昆高速出口长安方向)",
    "highway": "G60",
    "lng": 120.431611,
    "lat": 30.472957,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-79",
    "name": "盐官收费站(G92杭州湾环线高速出口)",
    "highway": "G92",
    "lng": 120.544746,
    "lat": 30.418077,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-80",
    "name": "长安收费站(G60沪昆高速入口西南向)",
    "highway": "G60",
    "lng": 120.429947,
    "lat": 30.477208,
    "region": "浙江·嘉兴",
    "direction": "入口"
  },
  {
    "id": "toll-嘉兴-81",
    "name": "新仓(独山港东)收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 121.215329,
    "lat": 30.719921,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-83",
    "name": "崇福收费站(G9903杭州都市圈环线出口)",
    "highway": "G9903",
    "lng": 120.483832,
    "lat": 30.544435,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-84",
    "name": "胡家兜收费站(G92杭州湾环线高速出口)",
    "highway": "G92",
    "lng": 120.447071,
    "lat": 30.405409,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-86",
    "name": "尖山收费站(G1522常台高速入口)",
    "highway": "G1522",
    "lng": 120.779858,
    "lat": 30.310362,
    "region": "浙江·嘉兴",
    "direction": "入口"
  },
  {
    "id": "toll-嘉兴-89",
    "name": "崇福北收费站(G9903杭州都市圈环线出口)",
    "highway": "G9903",
    "lng": 120.410778,
    "lat": 30.564116,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-90",
    "name": "许村南收费站(G60沪昆高速入口)",
    "highway": "G60",
    "lng": 120.397625,
    "lat": 30.412935,
    "region": "浙江·嘉兴",
    "direction": "入口"
  },
  {
    "id": "toll-嘉兴-94",
    "name": "洲泉收费站(G9903杭州都市圈环线出口)",
    "highway": "G9903",
    "lng": 120.358565,
    "lat": 30.554185,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-95",
    "name": "许村收费站(S2杭甬高速出口)",
    "highway": "S2",
    "lng": 120.357582,
    "lat": 30.421307,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-99",
    "name": "凤鸣收费站(G9903杭州都市圈环线入口)",
    "highway": "G9903",
    "lng": 120.451639,
    "lat": 30.56237,
    "region": "浙江·嘉兴",
    "direction": "入口"
  },
  {
    "id": "toll-嘉兴-102",
    "name": "07省道嘉兴收费站",
    "highway": "高速公路",
    "lng": 120.710676,
    "lat": 30.851308,
    "region": "浙江·嘉兴",
    "direction": "出入口"
  },
  {
    "id": "toll-嘉兴-103",
    "name": "黄湾收费站(G1522常台高速入口)",
    "highway": "G1522",
    "lng": 120.787357,
    "lat": 30.357671,
    "region": "浙江·嘉兴",
    "direction": "入口"
  },
  {
    "id": "toll-嘉兴-106",
    "name": "收费站(S9苏台高速出口)",
    "highway": "S9",
    "lng": 120.471619,
    "lat": 30.626148,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-107",
    "name": "武原收费站(杭浦高速公路出口)",
    "highway": "高速公路",
    "lng": 120.895113,
    "lat": 30.540614,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-108",
    "name": "收费站(杭浦高速公路出口)",
    "highway": "高速公路",
    "lng": 120.857643,
    "lat": 30.63053,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-111",
    "name": "收费站(G15沈海高速出口)",
    "highway": "G15",
    "lng": 121.172694,
    "lat": 30.697351,
    "region": "浙江·嘉兴",
    "direction": "出口"
  },
  {
    "id": "toll-嘉兴-113",
    "name": "洲泉收费站智在亭",
    "highway": "高速公路",
    "lng": 120.358454,
    "lat": 30.553452,
    "region": "浙江·嘉兴",
    "direction": "出入口"
  },
  {
    "id": "toll-金华-1",
    "name": "金华收费站(G60沪昆高速入口)",
    "highway": "G60",
    "lng": 119.651187,
    "lat": 29.142454,
    "region": "浙江·金华",
    "direction": "入口"
  },
  {
    "id": "toll-金华-3",
    "name": "收费站(甬金衢上高速入口)",
    "highway": "甬金高速",
    "lng": 119.655419,
    "lat": 29.02038,
    "region": "浙江·金华",
    "direction": "入口"
  },
  {
    "id": "toll-金华-4",
    "name": "婺城收费站(G60沪昆高速出口)",
    "highway": "G60",
    "lng": 119.569632,
    "lat": 29.133637,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-7",
    "name": "金华东收费站(G60沪昆高速出口)",
    "highway": "G60",
    "lng": 119.711744,
    "lat": 29.160413,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-8",
    "name": "岭下朱收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 119.753156,
    "lat": 29.056495,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-10",
    "name": "岭下朱收费站(甬金衢上高速入口)",
    "highway": "甬金高速",
    "lng": 119.757331,
    "lat": 29.057774,
    "region": "浙江·金华",
    "direction": "入口"
  },
  {
    "id": "toll-金华-11",
    "name": "兰溪收费站(G60沪昆高速出口)",
    "highway": "G60",
    "lng": 119.524928,
    "lat": 29.137446,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-15",
    "name": "武义收费站(G25长深高速出口武义方向)",
    "highway": "G25",
    "lng": 119.824505,
    "lat": 28.947292,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-16",
    "name": "武义收费站(G25长深高速入口东向)",
    "highway": "G25",
    "lng": 119.828015,
    "lat": 28.941077,
    "region": "浙江·金华",
    "direction": "入口"
  },
  {
    "id": "toll-金华-17",
    "name": "金义新区鞋塘收费站(G60沪昆高速出口)",
    "highway": "G60",
    "lng": 119.843441,
    "lat": 29.226145,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-19",
    "name": "金华西收费站(G60沪昆高速入口)",
    "highway": "G60",
    "lng": 119.369306,
    "lat": 29.097489,
    "region": "浙江·金华",
    "direction": "入口"
  },
  {
    "id": "toll-金华-21",
    "name": "马涧收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 119.660295,
    "lat": 29.324794,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-22",
    "name": "西田畈收费站(G25长深高速出口西田畈方向)",
    "highway": "G25",
    "lng": 119.866685,
    "lat": 28.926209,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-23",
    "name": "傅村收费站(G1512甬金高速出口)",
    "highway": "G1512",
    "lng": 119.873629,
    "lat": 29.23349,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-25",
    "name": "马涧收费站(G25长深高速入口)",
    "highway": "G25",
    "lng": 119.660333,
    "lat": 29.325036,
    "region": "浙江·金华",
    "direction": "入口"
  },
  {
    "id": "toll-金华-28",
    "name": "兰溪北收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 119.57392,
    "lat": 29.362271,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-29",
    "name": "游埠收费站(G60沪昆高速出口)",
    "highway": "G60",
    "lng": 119.314802,
    "lat": 29.107179,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-30",
    "name": "曹宅收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 119.736848,
    "lat": 29.207358,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-31",
    "name": "上溪收费站(G60沪昆高速出口)",
    "highway": "G60",
    "lng": 119.922505,
    "lat": 29.280694,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-37",
    "name": "义亭收费站(G1512甬金高速出口)",
    "highway": "G1512",
    "lng": 119.957235,
    "lat": 29.223558,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-38",
    "name": "佛堂收费站(G1512甬金高速出口)",
    "highway": "G1512",
    "lng": 120.003173,
    "lat": 29.231606,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-39",
    "name": "望道收费站(疏港快速路出口)",
    "highway": "高速公路",
    "lng": 119.961389,
    "lat": 29.298838,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-43",
    "name": "永康收费站(G25长深高速入口)",
    "highway": "G25",
    "lng": 120.004208,
    "lat": 28.858543,
    "region": "浙江·金华",
    "direction": "入口"
  },
  {
    "id": "toll-金华-45",
    "name": "徐村收费站(G1512甬金高速入口)",
    "highway": "G1512",
    "lng": 120.053582,
    "lat": 29.252248,
    "region": "浙江·金华",
    "direction": "入口"
  },
  {
    "id": "toll-金华-47",
    "name": "义乌收费站(G60沪昆高速出口)",
    "highway": "G60",
    "lng": 120.026167,
    "lat": 29.377172,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-48",
    "name": "永康东收费站(S27东永高速入口)",
    "highway": "S27",
    "lng": 120.11196,
    "lat": 28.887232,
    "region": "浙江·金华",
    "direction": "入口"
  },
  {
    "id": "toll-金华-50",
    "name": "方岩收费站(S27东永高速出口)",
    "highway": "S27",
    "lng": 120.161782,
    "lat": 28.948538,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-53",
    "name": "湖门收费站(S45义东高速出口)",
    "highway": "S45",
    "lng": 120.056534,
    "lat": 29.404887,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-54",
    "name": "S28前仓收费站(S28台金高速出口)",
    "highway": "S28",
    "lng": 120.092721,
    "lat": 28.811106,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-55",
    "name": "浦江收费站(G60沪昆高速入口)",
    "highway": "G60",
    "lng": 120.020406,
    "lat": 29.440094,
    "region": "浙江·金华",
    "direction": "入口"
  },
  {
    "id": "toll-金华-57",
    "name": "义乌东收费站(G1512甬金高速出口)",
    "highway": "G1512",
    "lng": 120.141085,
    "lat": 29.305458,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-60",
    "name": "福田收费站(S45义东高速出口)",
    "highway": "S45",
    "lng": 120.108314,
    "lat": 29.389393,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-62",
    "name": "西溪收费站(S27东永高速出口)",
    "highway": "S27",
    "lng": 120.217996,
    "lat": 29.01067,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-64",
    "name": "廿三里收费站(S45义东高速入口)",
    "highway": "S45",
    "lng": 120.184638,
    "lat": 29.336905,
    "region": "浙江·金华",
    "direction": "入口"
  },
  {
    "id": "toll-金华-66",
    "name": "苏溪收费站(S45义东高速出口)",
    "highway": "S45",
    "lng": 120.156379,
    "lat": 29.390935,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-69",
    "name": "郑家坞收费站(G60沪昆高速出口)",
    "highway": "G60",
    "lng": 120.075143,
    "lat": 29.503672,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-70",
    "name": "郑家坞收费站(G60沪昆高速入口)",
    "highway": "G60",
    "lng": 120.074996,
    "lat": 29.503841,
    "region": "浙江·金华",
    "direction": "入口"
  },
  {
    "id": "toll-金华-71",
    "name": "白云收费站(S45义东高速出口)",
    "highway": "S45",
    "lng": 120.202133,
    "lat": 29.25921,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-73",
    "name": "南马收费站(S45义东高速出口)",
    "highway": "S45",
    "lng": 120.229794,
    "lat": 29.091491,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-74",
    "name": "东阳西收费站(S45义东高速出口东阳西方向)",
    "highway": "S45",
    "lng": 120.20135,
    "lat": 29.299557,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-75",
    "name": "花园收费站(S45义东高速出口)",
    "highway": "S45",
    "lng": 120.218699,
    "lat": 29.146633,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-76",
    "name": "南溪收费站(S45义东高速出口义乌方向)",
    "highway": "S45",
    "lng": 120.209044,
    "lat": 29.199401,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-77",
    "name": "东阳收费站(G1512甬金高速出口)",
    "highway": "G1512",
    "lng": 120.260912,
    "lat": 29.311962,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-80",
    "name": "千祥收费站(S27东永高速入口)",
    "highway": "S27",
    "lng": 120.298908,
    "lat": 29.046588,
    "region": "浙江·金华",
    "direction": "入口"
  },
  {
    "id": "toll-金华-82",
    "name": "收费站(G1512甬金高速出口)",
    "highway": "G1512",
    "lng": 119.905458,
    "lat": 29.225162,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-83",
    "name": "马宅收费站(S26诸永高速出口)",
    "highway": "S26",
    "lng": 120.358847,
    "lat": 29.083254,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-84",
    "name": "横店收费站(S26诸永高速出口)",
    "highway": "S26",
    "lng": 120.374547,
    "lat": 29.160862,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-86",
    "name": "东阳西收费站(S45义东高速出口义乌方向)",
    "highway": "S45",
    "lng": 120.20888,
    "lat": 29.297453,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-87",
    "name": "收费站(甬金衢上高速出口)",
    "highway": "甬金高速",
    "lng": 119.541851,
    "lat": 29.021666,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-90",
    "name": "收费站(建武高速入口)",
    "highway": "高速公路",
    "lng": 119.50746,
    "lat": 29.092414,
    "region": "浙江·金华",
    "direction": "入口"
  },
  {
    "id": "toll-金华-91",
    "name": "义乌市湖门收费站",
    "highway": "高速公路",
    "lng": 120.05659,
    "lat": 29.404673,
    "region": "浙江·金华",
    "direction": "出入口"
  },
  {
    "id": "toll-金华-93",
    "name": "收费站(G1512甬金高速出口)",
    "highway": "G1512",
    "lng": 119.997434,
    "lat": 29.23012,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-95",
    "name": "湖溪收费站(S26诸永高速出口)",
    "highway": "S26",
    "lng": 120.380347,
    "lat": 29.206121,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-97",
    "name": "怀鲁收费站(G1512甬金高速出口)",
    "highway": "G1512",
    "lng": 120.369358,
    "lat": 29.345712,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-98",
    "name": "磐安收费站(S26诸永高速出口)",
    "highway": "S26",
    "lng": 120.420534,
    "lat": 28.97697,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-99",
    "name": "歌山收费站(S26诸永高速出口)",
    "highway": "S26",
    "lng": 120.393483,
    "lat": 29.27013,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-103",
    "name": "收费站(建武高速出口)",
    "highway": "高速公路",
    "lng": 119.470969,
    "lat": 29.160882,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-105",
    "name": "收费站(建武高速入口)",
    "highway": "高速公路",
    "lng": 119.425555,
    "lat": 29.177942,
    "region": "浙江·金华",
    "direction": "入口"
  },
  {
    "id": "toll-金华-107",
    "name": "收费站(甬金衢上高速出口)",
    "highway": "甬金高速",
    "lng": 119.408396,
    "lat": 29.035179,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-112",
    "name": "收费站(建武高速出口)",
    "highway": "高速公路",
    "lng": 119.376522,
    "lat": 29.245645,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-113",
    "name": "双峰收费站(S26诸永高速出口)",
    "highway": "S26",
    "lng": 120.449907,
    "lat": 28.923325,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-117",
    "name": "收费站(疏港快速路出口)",
    "highway": "高速公路",
    "lng": 119.997413,
    "lat": 29.23017,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-119",
    "name": "东永公路收费站长川收费点",
    "highway": "高速公路",
    "lng": 120.16585,
    "lat": 29.091435,
    "region": "浙江·金华",
    "direction": "出入口"
  },
  {
    "id": "toll-金华-120",
    "name": "蔡宅收费站(G1512甬金高速出口)",
    "highway": "G1512",
    "lng": 120.453321,
    "lat": 29.388008,
    "region": "浙江·金华",
    "direction": "出口"
  },
  {
    "id": "toll-金华-123",
    "name": "收费站(建武高速入口)",
    "highway": "高速公路",
    "lng": 119.366263,
    "lat": 29.280086,
    "region": "浙江·金华",
    "direction": "入口"
  },
  {
    "id": "toll-舟山-1",
    "name": "舟山收费站(G9211甬舟高速出口)",
    "highway": "G9211",
    "lng": 121.999006,
    "lat": 30.051068,
    "region": "浙江·舟山",
    "direction": "出口"
  },
  {
    "id": "toll-舟山-3",
    "name": "舟山西收费站(S6定岱高速出口)",
    "highway": "S6",
    "lng": 121.988202,
    "lat": 30.089978,
    "region": "浙江·舟山",
    "direction": "出口"
  },
  {
    "id": "toll-舟山-4",
    "name": "烟墩收费站(S6定岱高速出口)",
    "highway": "S6",
    "lng": 121.984732,
    "lat": 30.11468,
    "region": "浙江·舟山",
    "direction": "出口"
  },
  {
    "id": "toll-舟山-5",
    "name": "烟墩收费站(S6定岱高速入口)",
    "highway": "S6",
    "lng": 121.985056,
    "lat": 30.114779,
    "region": "浙江·舟山",
    "direction": "入口"
  },
  {
    "id": "toll-舟山-7",
    "name": "金塘收费站(G9211甬舟高速出口)",
    "highway": "G9211",
    "lng": 121.898098,
    "lat": 30.056376,
    "region": "浙江·舟山",
    "direction": "出口"
  },
  {
    "id": "toll-舟山-8",
    "name": "岱山收费站(S6定岱高速出口)",
    "highway": "S6",
    "lng": 122.063941,
    "lat": 30.297846,
    "region": "浙江·舟山",
    "direction": "出口"
  },
  {
    "id": "toll-舟山-9",
    "name": "沥港收费站(G9211甬舟高速出口沥港方向)",
    "highway": "G9211",
    "lng": 121.856102,
    "lat": 30.052104,
    "region": "浙江·舟山",
    "direction": "出口"
  },
  {
    "id": "toll-舟山-11",
    "name": "册子收费站(G9211甬舟高速出口)",
    "highway": "G9211",
    "lng": 121.936343,
    "lat": 30.079448,
    "region": "浙江·舟山",
    "direction": "出口"
  },
  {
    "id": "toll-舟山-12",
    "name": "岑港收费站(G9211甬舟高速出口舟山方向)",
    "highway": "G9211",
    "lng": 121.98388,
    "lat": 30.062762,
    "region": "浙江·舟山",
    "direction": "出口"
  },
  {
    "id": "toll-舟山-13",
    "name": "岑港收费站(G9211甬舟高速入口西北向)",
    "highway": "G9211",
    "lng": 121.987573,
    "lat": 30.069308,
    "region": "浙江·舟山",
    "direction": "入口"
  },
  {
    "id": "toll-舟山-16",
    "name": "长白收费站(S6定岱高速出口)",
    "highway": "S6",
    "lng": 122.017062,
    "lat": 30.183243,
    "region": "浙江·舟山",
    "direction": "出口"
  },
  {
    "id": "toll-舟山-18",
    "name": "里钓收费站(G9211甬舟高速出口里钓岛方向)",
    "highway": "G9211",
    "lng": 121.982526,
    "lat": 30.080795,
    "region": "浙江·舟山",
    "direction": "出口"
  },
  {
    "id": "toll-舟山-19",
    "name": "富翅收费站(甬舟高速复线出口)",
    "highway": "高速公路",
    "lng": 121.972367,
    "lat": 30.094936,
    "region": "浙江·舟山",
    "direction": "出口"
  },
  {
    "id": "toll-舟山-20",
    "name": "岑港北收费站(S6定岱高速出口定海方向)",
    "highway": "S6",
    "lng": 121.987426,
    "lat": 30.098186,
    "region": "浙江·舟山",
    "direction": "出口"
  },
  {
    "id": "toll-舟山-21",
    "name": "收费站(G9211甬舟高速入口)",
    "highway": "G9211",
    "lng": 121.969321,
    "lat": 30.093615,
    "region": "浙江·舟山",
    "direction": "入口"
  },
  {
    "id": "toll-舟山-22",
    "name": "富翅收费站(G9211甬舟高速出口)",
    "highway": "G9211",
    "lng": 121.971958,
    "lat": 30.095236,
    "region": "浙江·舟山",
    "direction": "出口"
  },
  {
    "id": "toll-舟山-24",
    "name": "收费站(S21六横疏港高速出口)",
    "highway": "S21",
    "lng": 119.495474,
    "lat": 29.927987,
    "region": "浙江·舟山",
    "direction": "出口"
  },
  {
    "id": "toll-舟山-28",
    "name": "收费站(甬舟高速复线出口)",
    "highway": "高速公路",
    "lng": 122.021208,
    "lat": 30.132201,
    "region": "浙江·舟山",
    "direction": "出口"
  },
  {
    "id": "toll-丽水-1",
    "name": "丽水北收费站(G25长深高速入口)",
    "highway": "G25",
    "lng": 119.865464,
    "lat": 28.480884,
    "region": "浙江·丽水",
    "direction": "入口"
  },
  {
    "id": "toll-丽水-3",
    "name": "丽水西收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 119.868124,
    "lat": 28.445109,
    "region": "浙江·丽水",
    "direction": "出口"
  },
  {
    "id": "toll-丽水-5",
    "name": "丽水南收费站(丽龙高速出口)",
    "highway": "高速公路",
    "lng": 119.900158,
    "lat": 28.397433,
    "region": "浙江·丽水",
    "direction": "出口"
  },
  {
    "id": "toll-丽水-7",
    "name": "石帆收费站(G1513温丽高速入口)",
    "highway": "G1513",
    "lng": 119.953147,
    "lat": 28.370154,
    "region": "浙江·丽水",
    "direction": "入口"
  },
  {
    "id": "toll-丽水-9",
    "name": "碧湖收费站(G25长深高速入口)",
    "highway": "G25",
    "lng": 119.787716,
    "lat": 28.328517,
    "region": "浙江·丽水",
    "direction": "入口"
  },
  {
    "id": "toll-丽水-10",
    "name": "海口收费站(G1513温丽高速入口)",
    "highway": "G1513",
    "lng": 120.068546,
    "lat": 28.317816,
    "region": "浙江·丽水",
    "direction": "入口"
  },
  {
    "id": "toll-丽水-13",
    "name": "洪渡收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 119.867266,
    "lat": 28.611849,
    "region": "浙江·丽水",
    "direction": "出口"
  },
  {
    "id": "toll-丽水-14",
    "name": "缙云收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 120.056626,
    "lat": 28.737699,
    "region": "浙江·丽水",
    "direction": "出口"
  },
  {
    "id": "toll-丽水-16",
    "name": "云和东收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 119.670518,
    "lat": 28.238885,
    "region": "浙江·丽水",
    "direction": "出口"
  },
  {
    "id": "toll-丽水-17",
    "name": "象溪收费站(G4012溧宁高速出口)",
    "highway": "G4012",
    "lng": 119.597156,
    "lat": 28.372162,
    "region": "浙江·丽水",
    "direction": "出口"
  },
  {
    "id": "toll-丽水-18",
    "name": "青田西收费站(G1513温丽高速出口)",
    "highway": "G1513",
    "lng": 120.199789,
    "lat": 28.264617,
    "region": "浙江·丽水",
    "direction": "出口"
  },
  {
    "id": "toll-丽水-22",
    "name": "松阳收费站(G4012溧宁高速出口)",
    "highway": "G4012",
    "lng": 119.462741,
    "lat": 28.430398,
    "region": "浙江·丽水",
    "direction": "出口"
  },
  {
    "id": "toll-丽水-24",
    "name": "S28壶镇收费站(S28台金高速出口)",
    "highway": "S28",
    "lng": 120.256287,
    "lat": 28.792401,
    "region": "浙江·丽水",
    "direction": "出口"
  },
  {
    "id": "toll-丽水-27",
    "name": "云和收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 119.588208,
    "lat": 28.103705,
    "region": "浙江·丽水",
    "direction": "出口"
  },
  {
    "id": "toll-丽水-28",
    "name": "古市收费站(G4012溧宁高速出口)",
    "highway": "G4012",
    "lng": 119.389811,
    "lat": 28.509054,
    "region": "浙江·丽水",
    "direction": "出口"
  },
  {
    "id": "toll-丽水-30",
    "name": "青田收费站(G1513温丽高速出口温州方向)",
    "highway": "G1513",
    "lng": 120.267557,
    "lat": 28.170921,
    "region": "浙江·丽水",
    "direction": "出口"
  },
  {
    "id": "toll-丽水-32",
    "name": "青田东收费站(G1513温丽高速出口)",
    "highway": "G1513",
    "lng": 120.356057,
    "lat": 28.13594,
    "region": "浙江·丽水",
    "direction": "出口"
  },
  {
    "id": "toll-丽水-35",
    "name": "遂昌东收费站(G4012溧宁高速出口)",
    "highway": "G4012",
    "lng": 119.325881,
    "lat": 28.605072,
    "region": "浙江·丽水",
    "direction": "出口"
  },
  {
    "id": "toll-丽水-36",
    "name": "景宁收费站(G4012溧宁高速出口景宁城区方向)",
    "highway": "G4012",
    "lng": 119.630485,
    "lat": 27.993219,
    "region": "浙江·丽水",
    "direction": "出口"
  },
  {
    "id": "toll-丽水-37",
    "name": "遂昌东收费站(G4012溧宁高速入口)",
    "highway": "G4012",
    "lng": 119.325764,
    "lat": 28.604955,
    "region": "浙江·丽水",
    "direction": "入口"
  },
  {
    "id": "toll-丽水-38",
    "name": "遂昌收费站(G4012溧宁高速出口)",
    "highway": "G4012",
    "lng": 119.271559,
    "lat": 28.630104,
    "region": "浙江·丽水",
    "direction": "出口"
  },
  {
    "id": "toll-丽水-41",
    "name": "赤石收费站(G25长深高速出口龙泉方向)",
    "highway": "G25",
    "lng": 119.454652,
    "lat": 28.125902,
    "region": "浙江·丽水",
    "direction": "出口"
  },
  {
    "id": "toll-丽水-42",
    "name": "龙泉安仁收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 119.347749,
    "lat": 28.069114,
    "region": "浙江·丽水",
    "direction": "出口"
  },
  {
    "id": "toll-丽水-43",
    "name": "新路湾收费站(G4012溧宁高速入口)",
    "highway": "G4012",
    "lng": 119.268369,
    "lat": 28.695203,
    "region": "浙江·丽水",
    "direction": "入口"
  },
  {
    "id": "toll-丽水-44",
    "name": "景宁南收费站(G4012溧宁高速入口)",
    "highway": "G4012",
    "lng": 119.615486,
    "lat": 27.924064,
    "region": "浙江·丽水",
    "direction": "入口"
  },
  {
    "id": "toll-丽水-45",
    "name": "北界收费站(G4012溧宁高速入口)",
    "highway": "G4012",
    "lng": 119.228423,
    "lat": 28.752441,
    "region": "浙江·丽水",
    "direction": "入口"
  },
  {
    "id": "toll-丽水-47",
    "name": "东坑收费站(G4012溧宁高速出口)",
    "highway": "G4012",
    "lng": 119.698803,
    "lat": 27.812337,
    "region": "浙江·丽水",
    "direction": "出口"
  },
  {
    "id": "toll-丽水-53",
    "name": "收费站(G4012溧宁高速出口)",
    "highway": "G4012",
    "lng": 118.784329,
    "lat": 29.720038,
    "region": "浙江·丽水",
    "direction": "出口"
  },
  {
    "id": "toll-丽水-54",
    "name": "龙泉东收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 119.186656,
    "lat": 28.04662,
    "region": "浙江·丽水",
    "direction": "出口"
  },
  {
    "id": "toll-丽水-55",
    "name": "收费站(G4012溧宁高速入口)",
    "highway": "G4012",
    "lng": 119.413313,
    "lat": 28.483057,
    "region": "浙江·丽水",
    "direction": "入口"
  },
  {
    "id": "toll-丽水-56",
    "name": "收费站(G4012溧宁高速出口)",
    "highway": "G4012",
    "lng": 119.411617,
    "lat": 28.474486,
    "region": "浙江·丽水",
    "direction": "出口"
  },
  {
    "id": "toll-丽水-61",
    "name": "龙泉收费站(G25长深高速入口)",
    "highway": "G25",
    "lng": 119.11551,
    "lat": 28.048848,
    "region": "浙江·丽水",
    "direction": "入口"
  },
  {
    "id": "toll-丽水-63",
    "name": "收费站(义龙庆高速出口)",
    "highway": "高速公路",
    "lng": 119.122064,
    "lat": 28.095689,
    "region": "浙江·丽水",
    "direction": "出口"
  },
  {
    "id": "toll-丽水-64",
    "name": "龙泉南收费站(G25长深高速入口)",
    "highway": "G25",
    "lng": 119.078942,
    "lat": 28.004121,
    "region": "浙江·丽水",
    "direction": "入口"
  },
  {
    "id": "toll-丽水-67",
    "name": "收费站(义龙庆高速出口)",
    "highway": "高速公路",
    "lng": 119.079618,
    "lat": 28.046484,
    "region": "浙江·丽水",
    "direction": "出口"
  },
  {
    "id": "toll-丽水-69",
    "name": "八都收费站(S36龙浦高速入口)",
    "highway": "S36",
    "lng": 118.957137,
    "lat": 27.983881,
    "region": "浙江·丽水",
    "direction": "入口"
  },
  {
    "id": "toll-丽水-71",
    "name": "五都垟收费站(S36龙浦高速入口西南向)",
    "highway": "S36",
    "lng": 118.855407,
    "lat": 27.940388,
    "region": "浙江·丽水",
    "direction": "入口"
  },
  {
    "id": "toll-丽水-72",
    "name": "五都垟收费站(S36龙浦高速出口五都垟收费站方向)",
    "highway": "S36",
    "lng": 118.854274,
    "lat": 27.93884,
    "region": "浙江·丽水",
    "direction": "出口"
  },
  {
    "id": "toll-丽水-73",
    "name": "上垟收费站(S36龙浦高速入口龙泉方向)",
    "highway": "S36",
    "lng": 118.865312,
    "lat": 27.946633,
    "region": "浙江·丽水",
    "direction": "入口"
  },
  {
    "id": "toll-丽水-75",
    "name": "查田收费站(G25长深高速入口)",
    "highway": "G25",
    "lng": 118.985641,
    "lat": 27.887183,
    "region": "浙江·丽水",
    "direction": "入口"
  },
  {
    "id": "toll-丽水-76",
    "name": "庆元收费站(G25长深高速入口)",
    "highway": "G25",
    "lng": 118.898049,
    "lat": 27.669796,
    "region": "浙江·丽水",
    "direction": "入口"
  },
  {
    "id": "toll-丽水-77",
    "name": "黄田收费站(G25长深高速入口)",
    "highway": "G25",
    "lng": 118.937039,
    "lat": 27.776823,
    "region": "浙江·丽水",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-21",
    "name": "半山收费站(秋石高架路出口)",
    "highway": "",
    "lng": 120.192352,
    "lat": 30.389641,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-34",
    "name": "三墩收费站(G25长深高速东入口)",
    "highway": "G25",
    "lng": 120.057344,
    "lat": 30.306113,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-35",
    "name": "坎红路收费站(S4机场公路出口坎红路方向)",
    "highway": "S4",
    "lng": 120.396892,
    "lat": 30.222779,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-36",
    "name": "杭州萧山收费站(S4机场公路出口杭州市区方向)",
    "highway": "S4",
    "lng": 120.385491,
    "lat": 30.218994,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-37",
    "name": "袁富收费站(G25长深高速出口杭州方向)",
    "highway": "G25",
    "lng": 120.105007,
    "lat": 30.113889,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-38",
    "name": "瓶窑收费站(S14杭长宜高速出口)",
    "highway": "S14",
    "lng": 119.96212,
    "lat": 30.347739,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-39",
    "name": "留下收费站(天目山路出口)",
    "highway": "",
    "lng": 120.043942,
    "lat": 30.242426,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-40",
    "name": "袁浦收费站(G2504杭州绕城高速出口袁浦方向)",
    "highway": "G2504",
    "lng": 120.150435,
    "lat": 30.122679,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-41",
    "name": "临平东收费站(东湖高架路出口)",
    "highway": "",
    "lng": 120.322099,
    "lat": 30.37346,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-42",
    "name": "萧山城区收费站(S4机场公路出口)",
    "highway": "S4",
    "lng": 120.375947,
    "lat": 30.21473,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-43",
    "name": "富春湾收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 120.034053,
    "lat": 30.033452,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-44",
    "name": "仙宅收费站(S43杭州绕城西复线出口)",
    "highway": "S43",
    "lng": 119.886631,
    "lat": 30.306114,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-45",
    "name": "浦阳收费站(G60沪昆高速入口)",
    "highway": "G60",
    "lng": 120.235944,
    "lat": 29.968028,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-46",
    "name": "新湾收费站(S9苏台高速入口)",
    "highway": "S9",
    "lng": 120.54236,
    "lat": 30.304916,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-47",
    "name": "所前收费站(S42柯桥联络线入口)",
    "highway": "S42",
    "lng": 120.294456,
    "lat": 30.086757,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-48",
    "name": "前进收费站(S9苏台高速入口)",
    "highway": "S9",
    "lng": 120.526176,
    "lat": 30.357864,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-49",
    "name": "党湾收费站(G9221杭绍甬高速出口)",
    "highway": "G9221",
    "lng": 120.556271,
    "lat": 30.238171,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-50",
    "name": "瓶窑收费站(运溪高架路出口)",
    "highway": "",
    "lng": 119.962124,
    "lat": 30.347946,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-51",
    "name": "径山收费站(S14杭长宜高速出口)",
    "highway": "S14",
    "lng": 119.888796,
    "lat": 30.39342,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-52",
    "name": "未来城收费站(S43杭州绕城西复线出口)",
    "highway": "S43",
    "lng": 119.870586,
    "lat": 30.273546,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-53",
    "name": "青山湖收费站(G56杭瑞高速入口)",
    "highway": "G56",
    "lng": 119.841045,
    "lat": 30.254084,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-54",
    "name": "党湾收费站(S9苏台高速出口)",
    "highway": "S9",
    "lng": 120.556039,
    "lat": 30.238372,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-55",
    "name": "富阳北收费站(S43杭州绕城西复线出口)",
    "highway": "S43",
    "lng": 119.854057,
    "lat": 30.131799,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-56",
    "name": "益农收费站(S9苏台高速入口)",
    "highway": "S9",
    "lng": 120.56653,
    "lat": 30.195541,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-57",
    "name": "富阳收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 119.951193,
    "lat": 30.005258,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-58",
    "name": "南庄兜收费站(上塘高架路出口)",
    "highway": "",
    "lng": 120.115464,
    "lat": 30.380282,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-59",
    "name": "九峰收费站(G56杭瑞高速出口)",
    "highway": "G56",
    "lng": 119.870312,
    "lat": 30.252132,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-60",
    "name": "富阳收费站(富春湾大道出口)",
    "highway": "",
    "lng": 119.950921,
    "lat": 30.005133,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-61",
    "name": "瓶窑西收费站(S43杭州绕城西复线入口)",
    "highway": "S43",
    "lng": 119.881621,
    "lat": 30.417372,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-62",
    "name": "富阳南收费站(S43杭州绕城西复线入口)",
    "highway": "S43",
    "lng": 120.004879,
    "lat": 29.962181,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-63",
    "name": "临江南收费站(G9221杭绍甬高速出口)",
    "highway": "G9221",
    "lng": 120.606079,
    "lat": 30.244065,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-64",
    "name": "楼塔收费站(S43杭州绕城西复线出口)",
    "highway": "S43",
    "lng": 120.136179,
    "lat": 29.885012,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-65",
    "name": "黄湖收费站(S14杭长宜高速出口)",
    "highway": "S14",
    "lng": 119.819389,
    "lat": 30.446638,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-66",
    "name": "鹿山收费站(S43杭州绕城西复线出口)",
    "highway": "S43",
    "lng": 119.876519,
    "lat": 29.974739,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-67",
    "name": "富阳西收费站(S43杭州绕城西复线入口)",
    "highway": "S43",
    "lng": 119.827938,
    "lat": 30.023631,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-68",
    "name": "临安收费站(G56杭瑞高速出口)",
    "highway": "G56",
    "lng": 119.746136,
    "lat": 30.222833,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-69",
    "name": "崇贤收费站(运溪高架路出口)",
    "highway": "",
    "lng": 120.154014,
    "lat": 30.402359,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-70",
    "name": "龙门古镇收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 119.918545,
    "lat": 29.930517,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-71",
    "name": "百丈收费站(S14杭长宜高速出口)",
    "highway": "S14",
    "lng": 119.776581,
    "lat": 30.472955,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-72",
    "name": "昌化收费站(G56杭瑞高速出口)",
    "highway": "G56",
    "lng": 119.222213,
    "lat": 30.168402,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-73",
    "name": "於潜北收费站(S29临金高速入口)",
    "highway": "S29",
    "lng": 119.370376,
    "lat": 30.244576,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-74",
    "name": "於潜收费站(G56杭瑞高速出口)",
    "highway": "G56",
    "lng": 119.371504,
    "lat": 30.179056,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-75",
    "name": "大店口收费站(G4012溧宁高速出口)",
    "highway": "G4012",
    "lng": 119.151193,
    "lat": 29.265035,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-76",
    "name": "寿昌收费站(G4012溧宁高速入口)",
    "highway": "G4012",
    "lng": 119.236823,
    "lat": 29.401923,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-77",
    "name": "新安江收费站(G4012溧宁高速入口)",
    "highway": "G4012",
    "lng": 119.328397,
    "lat": 29.519402,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-78",
    "name": "杨村桥收费站(G6021杭长高速出口)",
    "highway": "G6021",
    "lng": 119.435377,
    "lat": 29.569159,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-79",
    "name": "玲珑收费站(G56杭瑞高速入口)",
    "highway": "G56",
    "lng": 119.658189,
    "lat": 30.202915,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-80",
    "name": "安仁收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 119.595234,
    "lat": 29.688859,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-81",
    "name": "富春江收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 119.631557,
    "lat": 29.723634,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-82",
    "name": "凤川收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 119.766295,
    "lat": 29.816541,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-83",
    "name": "黄湖收费站入口(杭州方向)",
    "highway": "",
    "lng": 119.823226,
    "lat": 30.447044,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-84",
    "name": "百丈收费站入口(安吉方向)",
    "highway": "",
    "lng": 119.774169,
    "lat": 30.478405,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-85",
    "name": "前进收费站入口(绍兴方向)",
    "highway": "",
    "lng": 120.522695,
    "lat": 30.355804,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-86",
    "name": "临平收费站入口(东湖高架路方向)",
    "highway": "",
    "lng": 120.311562,
    "lat": 30.382889,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-87",
    "name": "乔司东收费站入口(G2504杭州绕城高速西向)",
    "highway": "G2504",
    "lng": 120.279559,
    "lat": 30.343856,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-88",
    "name": "临平东收费站入口(杭州北方向)",
    "highway": "",
    "lng": 120.323141,
    "lat": 30.37196,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-89",
    "name": "半山收费站入口(G2504杭州绕城高速西北向)",
    "highway": "G2504",
    "lng": 120.192197,
    "lat": 30.390124,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-90",
    "name": "崇贤收费站入口(S13方向)",
    "highway": "S13",
    "lng": 120.155423,
    "lat": 30.403472,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-91",
    "name": "良渚收费站入口(黄山方向)",
    "highway": "",
    "lng": 120.063761,
    "lat": 30.362025,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-92",
    "name": "南庄兜收费站入口(通益路方向)",
    "highway": "",
    "lng": 120.115456,
    "lat": 30.378119,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-93",
    "name": "瓶窑收费站入口(运溪高架路南向)",
    "highway": "",
    "lng": 119.966322,
    "lat": 30.344306,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-94",
    "name": "径山收费站入口(杭州方向)",
    "highway": "",
    "lng": 119.886673,
    "lat": 30.390578,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-95",
    "name": "下沙南收费站入口(G60沪昆高速南向)",
    "highway": "G60",
    "lng": 120.348739,
    "lat": 30.278722,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-96",
    "name": "三墩收费站入口(留石高架路方向)",
    "highway": "",
    "lng": 120.041859,
    "lat": 30.305294,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-97",
    "name": "五常收费站入口(湖州方向)",
    "highway": "",
    "lng": 120.04253,
    "lat": 30.281929,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-98",
    "name": "仙宅收费站入口(安吉方向)",
    "highway": "",
    "lng": 119.884627,
    "lat": 30.310697,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-99",
    "name": "余杭收费站入口(G56杭瑞高速东向)",
    "highway": "G56",
    "lng": 119.955812,
    "lat": 30.252924,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-100",
    "name": "九峰收费站入口(余杭方向)",
    "highway": "",
    "lng": 119.872848,
    "lat": 30.251342,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-101",
    "name": "未来城收费站入口(黄山方向)",
    "highway": "",
    "lng": 119.868079,
    "lat": 30.277657,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-102",
    "name": "横路收费站入口(S29临金高速南向)",
    "highway": "S29",
    "lng": 119.309793,
    "lat": 30.320668,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-103",
    "name": "临江南收费站入口(杭州方向)",
    "highway": "",
    "lng": 120.601429,
    "lat": 30.238424,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-104",
    "name": "益农收费站入口(嘉兴方向)",
    "highway": "",
    "lng": 120.571819,
    "lat": 30.197807,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-105",
    "name": "党湾收费站入口(绍兴方向)",
    "highway": "",
    "lng": 120.560337,
    "lat": 30.236151,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-106",
    "name": "瓜沥收费站入口(G92方向)",
    "highway": "G92",
    "lng": 120.445719,
    "lat": 30.198419,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-107",
    "name": "萧山东收费站入口(G60沪昆高速北向)",
    "highway": "G60",
    "lng": 120.336705,
    "lat": 30.178413,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-108",
    "name": "杭州西收费站入口(G56杭瑞高速西向)",
    "highway": "G56",
    "lng": 120.025302,
    "lat": 30.241277,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-109",
    "name": "留下收费站入口(G25长深高速西北向)",
    "highway": "G25",
    "lng": 120.041935,
    "lat": 30.242093,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-110",
    "name": "龙坞收费站入口(G25长深高速北向)",
    "highway": "G25",
    "lng": 120.052507,
    "lat": 30.195045,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-111",
    "name": "玲珑收费站入口(杭州方向)",
    "highway": "",
    "lng": 119.654026,
    "lat": 30.201591,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-112",
    "name": "天目山收费站入口(黄山方向)",
    "highway": "",
    "lng": 119.482969,
    "lat": 30.202443,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-113",
    "name": "新萧山收费站(S2杭甬高速东向)",
    "highway": "S2",
    "lng": 120.348807,
    "lat": 30.225975,
    "region": "浙江·杭州",
    "direction": "不限"
  },
  {
    "id": "toll-浙江杭州-114",
    "name": "党湾主线收费站(G9221杭绍甬高速东向)",
    "highway": "G9221",
    "lng": 120.564316,
    "lat": 30.235597,
    "region": "浙江·杭州",
    "direction": "不限"
  },
  {
    "id": "toll-浙江杭州-115",
    "name": "场口收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 119.866089,
    "lat": 29.906498,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-116",
    "name": "富春湾收费站(富春湾大道出口)",
    "highway": "",
    "lng": 120.034377,
    "lat": 30.033086,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-117",
    "name": "收费站(杭淳开高速出口)",
    "highway": "",
    "lng": 119.712848,
    "lat": 30.028228,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-118",
    "name": "深澳收费站(G25长深高速入口)",
    "highway": "G25",
    "lng": 119.828478,
    "lat": 29.857999,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-119",
    "name": "桐庐收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 119.712869,
    "lat": 29.776533,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-120",
    "name": "横村收费站(S29临金高速出口)",
    "highway": "S29",
    "lng": 119.581447,
    "lat": 29.824273,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-121",
    "name": "瑶琳收费站(S29临金高速出口)",
    "highway": "S29",
    "lng": 119.522937,
    "lat": 29.899668,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-122",
    "name": "收费站(S29临金高速入口)",
    "highway": "S29",
    "lng": 119.495474,
    "lat": 29.927987,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-123",
    "name": "05、16省道桐庐段瑶琳收费站(302省道西南向)",
    "highway": "",
    "lng": 119.607213,
    "lat": 29.944562,
    "region": "浙江·杭州",
    "direction": "不限"
  },
  {
    "id": "toll-浙江杭州建德-124",
    "name": "乾潭收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 119.513375,
    "lat": 29.623887,
    "region": "浙江·杭州·建德",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州建德-125",
    "name": "梅城收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 119.450263,
    "lat": 29.514768,
    "region": "浙江·杭州·建德",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州建德-126",
    "name": "收费站(G25长深高速入口)",
    "highway": "G25",
    "lng": 119.450361,
    "lat": 29.515705,
    "region": "浙江·杭州·建德",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州建德-127",
    "name": "大洋收费站(G25长深高速出口)",
    "highway": "G25",
    "lng": 119.499147,
    "lat": 29.434111,
    "region": "浙江·杭州·建德",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州建德-128",
    "name": "收费站",
    "highway": "",
    "lng": 119.297381,
    "lat": 29.418507,
    "region": "浙江·杭州·建德",
    "direction": "不限"
  },
  {
    "id": "toll-浙江杭州建德-129",
    "name": "大同收费站(G6021杭长高速出口)",
    "highway": "G6021",
    "lng": 119.079614,
    "lat": 29.312838,
    "region": "浙江·杭州·建德",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州建德-130",
    "name": "航头收费站(G4012溧宁高速入口)",
    "highway": "G4012",
    "lng": 119.169651,
    "lat": 29.331065,
    "region": "浙江·杭州·建德",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州建德-131",
    "name": "天目山收费站(G56杭瑞高速出口藻溪方向)",
    "highway": "G56",
    "lng": 119.498088,
    "lat": 30.20201,
    "region": "浙江·杭州·建德",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州建德-132",
    "name": "乐平收费站(S29临金高速出口)",
    "highway": "S29",
    "lng": 119.408523,
    "lat": 30.015372,
    "region": "浙江·杭州·建德",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州建德-133",
    "name": "太阳收费站(G56杭瑞高速出口)",
    "highway": "G56",
    "lng": 119.304456,
    "lat": 30.184191,
    "region": "浙江·杭州·建德",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州建德-134",
    "name": "横路收费站(S29临金高速出口宣城方向)",
    "highway": "S29",
    "lng": 119.309045,
    "lat": 30.323905,
    "region": "浙江·杭州·建德",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州建德-135",
    "name": "潜川收费站(S29临金高速入口)",
    "highway": "S29",
    "lng": 119.363157,
    "lat": 30.117724,
    "region": "浙江·杭州·建德",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州建德-136",
    "name": "白果收费站(G56杭瑞高速入口)",
    "highway": "G56",
    "lng": 118.989964,
    "lat": 30.094407,
    "region": "浙江·杭州·建德",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州建德-137",
    "name": "龙岗收费站(G56杭瑞高速入口)",
    "highway": "G56",
    "lng": 119.136308,
    "lat": 30.167864,
    "region": "浙江·杭州·建德",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州建德-138",
    "name": "清凉峰收费站(G56杭瑞高速出口清凉峰方向)",
    "highway": "G56",
    "lng": 119.02883,
    "lat": 30.128671,
    "region": "浙江·杭州·建德",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-139",
    "name": "汪宅收费站(G4012溧宁高速出口)",
    "highway": "G4012",
    "lng": 119.02775,
    "lat": 29.689684,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-140",
    "name": "宋村收费站(G4012溧宁高速入口)",
    "highway": "G4012",
    "lng": 118.846447,
    "lat": 29.67621,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-141",
    "name": "威坪收费站(G4012溧宁高速入口)",
    "highway": "G4012",
    "lng": 118.784506,
    "lat": 29.720233,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-143",
    "name": "青溪收费站(G4012溧宁高速出口青溪方向)",
    "highway": "G4012",
    "lng": 119.151569,
    "lat": 29.613305,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-144",
    "name": "千岛湖收费站(G4012溧宁高速出口)",
    "highway": "G4012",
    "lng": 119.089113,
    "lat": 29.662227,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-145",
    "name": "淡竹收费站(G4012溧宁高速入口)",
    "highway": "G4012",
    "lng": 119.221324,
    "lat": 29.560549,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-146",
    "name": "富春湾收费站入口(G25长深高速北向)",
    "highway": "G25",
    "lng": 120.031805,
    "lat": 30.032528,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-147",
    "name": "袁富收费站入口(杭州方向)",
    "highway": "",
    "lng": 120.105136,
    "lat": 30.1139,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-148",
    "name": "富阳收费站入口(G25长深高速东向)",
    "highway": "G25",
    "lng": 119.948506,
    "lat": 30.007818,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-149",
    "name": "仁和收费站入口(G25长深高速西北向)",
    "highway": "G25",
    "lng": 120.098065,
    "lat": 30.44452,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-150",
    "name": "乐平收费站入口(千岛湖方向)",
    "highway": "",
    "lng": 119.414033,
    "lat": 30.0143,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-151",
    "name": "潜川收费站入口(千岛湖方向)",
    "highway": "",
    "lng": 119.359851,
    "lat": 30.123887,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-152",
    "name": "横村收费站入口(千岛湖方向)",
    "highway": "",
    "lng": 119.57817,
    "lat": 29.821705,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-153",
    "name": "瑶琳收费站入口(千岛湖方向)",
    "highway": "",
    "lng": 119.517899,
    "lat": 29.90041,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-154",
    "name": "场口收费站入口(杭州方向)",
    "highway": "",
    "lng": 119.868538,
    "lat": 29.904298,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-155",
    "name": "梅城收费站入口(杭州方向)",
    "highway": "",
    "lng": 119.447384,
    "lat": 29.512766,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-156",
    "name": "凤川收费站入口(杭州方向)",
    "highway": "",
    "lng": 119.762799,
    "lat": 29.818237,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-157",
    "name": "清凉峰收费站入口(G56方向)",
    "highway": "G56",
    "lng": 119.033863,
    "lat": 30.129449,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-158",
    "name": "余杭街道G56杭徽高速余杭收费站办公大楼",
    "highway": "G56",
    "lng": 119.956542,
    "lat": 30.250967,
    "region": "浙江·杭州",
    "direction": "不限"
  },
  {
    "id": "toll-浙江杭州-159",
    "name": "昌化收费站入口(杭州方向)",
    "highway": "",
    "lng": 119.223274,
    "lat": 30.172979,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-160",
    "name": "太阳收费站入口(黄山方向)",
    "highway": "",
    "lng": 119.302564,
    "lat": 30.182746,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-161",
    "name": "白果收费站入口(黄山方向)",
    "highway": "",
    "lng": 118.988024,
    "lat": 30.091694,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-162",
    "name": "浦阳收费站入口(G60沪昆高速南向)",
    "highway": "G60",
    "lng": 120.235939,
    "lat": 29.968031,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-163",
    "name": "上城区杭州收费站S2杭甬高速出口公安检查站",
    "highway": "S2",
    "lng": 120.2513,
    "lat": 30.331104,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-164",
    "name": "德胜快速路入口(杭州收费站方向)",
    "highway": "",
    "lng": 120.214137,
    "lat": 30.308022,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-165",
    "name": "於潜收费站入口(黄山方向)",
    "highway": "",
    "lng": 119.369701,
    "lat": 30.176723,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-167",
    "name": "店口南收费站(G9903杭州都市圈环线出口柯桥方向)",
    "highway": "G9903",
    "lng": 120.298577,
    "lat": 29.880283,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-168",
    "name": "姚江收费站(G9903杭州都市圈环线出口)",
    "highway": "G9903",
    "lng": 120.291691,
    "lat": 29.842828,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-170",
    "name": "青溪收费站入口(G4012溧宁高速北向)",
    "highway": "G4012",
    "lng": 119.152326,
    "lat": 29.616997,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-171",
    "name": "富盛收费站入口(诸暨方向)",
    "highway": "",
    "lng": 120.705255,
    "lat": 29.966179,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-174",
    "name": "安华收费站入口(绍兴方向)",
    "highway": "",
    "lng": 120.137012,
    "lat": 29.576554,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-175",
    "name": "璜山收费站(S26诸永高速出口)",
    "highway": "S26",
    "lng": 120.320631,
    "lat": 29.588042,
    "region": "浙江·杭州",
    "direction": "出口"
  },
  {
    "id": "toll-浙江杭州-176",
    "name": "陈宅收费站(S26诸永高速入口)",
    "highway": "S26",
    "lng": 120.339052,
    "lat": 29.512408,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-178",
    "name": "枫桥南收费站入口(诸暨方向)",
    "highway": "",
    "lng": 120.393384,
    "lat": 29.764648,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-179",
    "name": "枫桥北收费站入口(诸暨方向)",
    "highway": "",
    "lng": 120.446947,
    "lat": 29.811463,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-180",
    "name": "诸暨浣东收费站入口(杭州方向)",
    "highway": "",
    "lng": 120.293764,
    "lat": 29.749212,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-181",
    "name": "直埠收费站入口(绍兴方向)",
    "highway": "",
    "lng": 120.235838,
    "lat": 29.817119,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州-182",
    "name": "兰亭收费站入口(诸暨方向)",
    "highway": "",
    "lng": 120.511372,
    "lat": 29.908472,
    "region": "浙江·杭州",
    "direction": "入口"
  },
  {
    "id": "toll-浙江杭州建德-183",
    "name": "寿昌收费站入口(衢州方向)",
    "highway": "",
    "lng": 119.236317,
    "lat": 29.398937,
    "region": "浙江·杭州·建德",
    "direction": "入口"
  }
];
