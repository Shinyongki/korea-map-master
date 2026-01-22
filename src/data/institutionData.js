
// District Center Coordinates (Approximate)
const DISTRICT_CENTERS = {
    "창원시": [35.2279, 128.6811],
    "진주시": [35.1805, 128.1076],
    "통영시": [34.8545, 128.4332],
    "사천시": [34.9358, 128.0833],
    "김해시": [35.2285, 128.8894],
    "밀양시": [35.5036, 128.7466],
    "거제시": [34.8806, 128.6211],
    "양산시": [35.3348, 129.0373],
    "의령군": [35.3223, 128.2618],
    "함안군": [35.2721, 128.4065],
    "창녕군": [35.5415, 128.4924],
    "고성군": [34.9754, 128.3234],
    "남해군": [34.8378, 127.8924],
    "하동군": [35.0673, 127.7513],
    "산청군": [35.4156, 127.8735],
    "함양군": [35.5204, 127.7251],
    "거창군": [35.6865, 127.9095],
    "합천군": [35.5667, 128.1658]
};

// Raw Data from CSV (Parsed)
const RAW_DATA = [
    {
        "district": "광역지원기관",
        "name": "(재)경상남도 사회서비스원",
        "type": "사회서비스원",
        "address": "경남 창원시 성산구 창원대로524",
        "phone": "055-288-6892",
        "leader": "조철현",
        "staff_assigned": 0,
        "target_assigned": 0,
        "social_worker_assigned": 5
    },
    {
        "district": "거제시",
        "name": "거제노인통합지원센터",
        "type": "재가노인복지시설",
        "address": "경남 거제시 거제중앙로 1772",
        "phone": "055-638-2111",
        "leader": "김창규",
        "staff_assigned": 59,
        "target_assigned": 970
    },
    {
        "district": "거제시",
        "name": "거제사랑노인복지센터",
        "type": "재가노인복지시설",
        "address": "경상남도 거제시 고현로12길 6",
        "phone": "055-637-6674",
        "leader": "이형철",
        "staff_assigned": 61,
        "target_assigned": 895
    },
    {
        "district": "거제시",
        "name": "하청교회 행복늘푸른대학",
        "type": "노인여가복지시설",
        "address": "경남 거제시 하청면 하청로 21-1",
        "phone": "055-636-6660",
        "leader": "홍명택",
        "staff_assigned": 100,
        "target_assigned": 30,
        "social_worker_assigned": 100
    },
    {
        "district": "거제시",
        "name": "은빛노인통합지원센터",
        "type": "사회복지법인",
        "address": "경남 거제시 거제면 거제남서로 3554-9",
        "phone": "055-950-0595",
        "leader": "김은란",
        "staff_assigned": 2,
        "target_assigned": 33
    },
    {
        "district": "거창군",
        "name": "거창노인통합지원센터",
        "type": "사회복지법인",
        "address": "경상남도 거창군 거창읍 창동로 174(2층)",
        "phone": "055-945-3365",
        "leader": "이경은",
        "staff_assigned": 46,
        "target_assigned": 690
    },
    {
        "district": "거창군",
        "name": "거창인애노인통합지원센터",
        "type": "재가노인복지시설",
        "address": "경상남도 거창군 거창읍 장팔길 93, 2층",
        "phone": "055-942-9116",
        "leader": "김천호",
        "staff_assigned": 46,
        "target_assigned": 690
    },
    {
        "district": "거창군",
        "name": "해월노인복지센터",
        "type": "재가노인복지시설",
        "address": "경남 거창군 거창읍 절부길 13-26",
        "phone": "055-945-1080",
        "leader": "염병섭",
        "staff_assigned": 44,
        "target_assigned": 660
    },
    {
        "district": "고성군",
        "name": "대한노인회 고성군지회",
        "type": "사단법인",
        "address": "경남 고성군 고성읍 남포로79번길 133",
        "phone": "055-804-7500",
        "leader": "최종림",
        "staff_assigned": 80,
        "target_assigned": 1200
    },
    {
        "district": "고성군",
        "name": "사회적협동조합 노인세상",
        "type": "협동조합",
        "address": "경남 고성군 고성읍 동외로 212",
        "phone": "055-674-8989",
        "leader": "배상길",
        "staff_assigned": 4,
        "target_assigned": 64
    },
    {
        "district": "김해시",
        "name": "효능원노인통합지원센터",
        "type": "재가노인복지시설",
        "address": "경상남도 김해시 진영읍 서부로 38번길 77-35",
        "phone": "055-343-7900",
        "leader": "이선자",
        "staff_assigned": 37,
        "target_assigned": 605
    },
    {
        "district": "김해시",
        "name": "김해시종합사회복지관",
        "type": "사회복지관",
        "address": "경상남도 김해시 분성로 227",
        "phone": "055-329-6336",
        "leader": "김희년",
        "staff_assigned": 42,
        "target_assigned": 655
    },
    {
        "district": "김해시",
        "name": "생명의전화노인통합지원센터",
        "type": "재가노인복지시설",
        "address": "경상남도 김해시 삼계로 69번길 15",
        "phone": "055-325-9195",
        "leader": "김병식",
        "staff_assigned": 42,
        "target_assigned": 680
    },
    {
        "district": "김해시",
        "name": "보현행원노인통합지원센터",
        "type": "재가노인복지시설",
        "address": "경상남도 김해시 주촌면 서부로1295번길 219",
        "phone": "055-329-0070",
        "leader": "이진학",
        "staff_assigned": 33,
        "target_assigned": 545
    },
    {
        "district": "김해시",
        "name": "김해돌봄지원센터",
        "type": "협동조합",
        "address": "경남 김해시 구산로27번길 4-2",
        "phone": "055-724-0515",
        "leader": "이소라",
        "staff_assigned": 31,
        "target_assigned": 490
    },
    {
        "district": "남해군",
        "name": "화방남해노인통합지원센터",
        "type": "재가노인복지시설",
        "address": "경상남도 남해군 고현면 화방로211번길81-7",
        "phone": "055-863-1737",
        "leader": "고현옥",
        "staff_assigned": 68,
        "target_assigned": 1020
    },
    {
        "district": "남해군",
        "name": "화방재가복지센터",
        "type": "재가노인복지시설",
        "address": "경상남도 남해군 고현면 화방로211번길 81-20",
        "phone": "055-863-1988",
        "leader": "천지훈",
        "staff_assigned": 68,
        "target_assigned": 1020
    },
    {
        "district": "밀양시",
        "name": "밀양시자원봉사단체협의회",
        "type": "사단법인",
        "address": "경남 밀양시 밀성로3길 9",
        "phone": "055-352-0094",
        "leader": "정준호",
        "staff_assigned": 61,
        "target_assigned": 915
    },
    {
        "district": "밀양시",
        "name": "밀양노인통합지원센터",
        "type": "재가노인복지시설",
        "address": "경상남도 밀양시 초동면 성만1길 50-8",
        "phone": "055-391-1900",
        "leader": "박래훈",
        "staff_assigned": 62,
        "target_assigned": 930
    },
    {
        "district": "밀양시",
        "name": "우리들노인통합지원센터",
        "type": "재가노인복지시설",
        "address": "경남 밀양시 용평로 49-6",
        "phone": "055-802-8765",
        "leader": "김두영",
        "staff_assigned": 50,
        "target_assigned": 800
    },
    {
        "district": "사천시",
        "name": "사랑원노인지원센터",
        "type": "재가노인복지시설",
        "address": "경상남도 사천시 사남면 사남로 847-15",
        "phone": "055-853-8894",
        "leader": "최미경",
        "staff_assigned": 80,
        "target_assigned": 1200
    },
    {
        "district": "사천시",
        "name": "사천노인통합지원센터",
        "type": "재가노인복지시설",
        "address": "경상남도 사천시 백천길 16",
        "phone": "055-833-3700",
        "leader": "박시현",
        "staff_assigned": 96,
        "target_assigned": 1440
    },
    {
        "district": "사천시",
        "name": "남양양로원",
        "type": "노인주거복지시설",
        "address": "경남 사천시 모충길 50",
        "phone": "055-835-9105",
        "leader": "조덕래",
        "staff_assigned": 4,
        "target_assigned": 43
    },
    {
        "district": "사천시",
        "name": "사천건양주야간보호센터",
        "type": "재가노인복지시설",
        "address": "경남 사천시 사천읍 구암두문로 338",
        "phone": "055-854-5913",
        "leader": "이종석",
        "staff_assigned": 3,
        "target_assigned": 43
    },
    {
        "district": "산청군",
        "name": "산청한일노인통합지원센터",
        "type": "재가노인복지시설",
        "address": "경상남도 산청군 산청읍 웅석봉로 67번길 24",
        "phone": "055-974-1200",
        "leader": "이현호",
        "staff_assigned": 35,
        "target_assigned": 512
    },
    {
        "district": "산청군",
        "name": "산청복음노인통합지원센터",
        "type": "재가노인복지시설",
        "address": "경상남도 산청군 단성면 목화로 998",
        "phone": "055-973-5411",
        "leader": "이영란",
        "staff_assigned": 34,
        "target_assigned": 512
    },
    {
        "district": "산청군",
        "name": "산청해민노인통합지원센터",
        "type": "재가노인복지시설",
        "address": "경남 산청군 신안면 원지강변로 119",
        "phone": "055-974-1991",
        "leader": "이해령",
        "staff_assigned": 34,
        "target_assigned": 512
    },
    {
        "district": "산청군",
        "name": "산청성모노인통합지원센터",
        "type": "재가노인복지시설",
        "address": "경남 산청군 금서면 친환경로 2016",
        "phone": "055-974-1095",
        "leader": "권수경",
        "staff_assigned": 34,
        "target_assigned": 512
    },
    {
        "district": "양산시",
        "name": "사회복지법인신생원양산재가노인복지센터",
        "type": "재가노인복지시설",
        "address": "경남 양산시 강변로 441",
        "phone": "055-367-8904",
        "leader": "유미주",
        "staff_assigned": 59,
        "target_assigned": 935
    },
    {
        "district": "양산시",
        "name": "양산행복한돌봄 사회적협동조합",
        "type": "협동조합",
        "address": "경남 양산시 중앙우회로 150",
        "phone": "055-367-3750",
        "leader": "노춘화",
        "staff_assigned": 59,
        "target_assigned": 885
    },
    {
        "district": "양산시",
        "name": "성요셉소규모노인종합센터",
        "type": "노인주거복지시설",
        "address": "경남 양산시 대운1길 111",
        "phone": "055-365-1910",
        "leader": "김희정",
        "staff_assigned": 59,
        "target_assigned": 880
    },
    {
        "district": "의령군",
        "name": "의령노인통합지원센터",
        "type": "재가노인복지시설",
        "address": "경상남도 의령군 궁류면 청정로 1224",
        "phone": "055-572-0079",
        "leader": "정선남",
        "staff_assigned": 80,
        "target_assigned": 1200
    },
    {
        "district": "진주시",
        "name": "진양노인통합지원센터",
        "type": "재가노인복지시설",
        "address": "경상남도 진주시 명석면 진주대로 2116",
        "phone": "055-743-3466",
        "leader": "최미선",
        "staff_assigned": 48,
        "target_assigned": 720
    },
    {
        "district": "진주시",
        "name": "진주노인통합지원센터",
        "type": "재가노인복지시설",
        "address": "경상남도 진주시 장재새미길 53번길 35",
        "phone": "055-761-0086",
        "leader": "김성광",
        "staff_assigned": 48,
        "target_assigned": 720
    },
    {
        "district": "진주시",
        "name": "나누리노인통합지원센터",
        "type": "재가노인복지시설",
        "address": "경남 진주시 집현면 신당길 300-50",
        "phone": "055-762-1001",
        "leader": "김선옥",
        "staff_assigned": 62,
        "target_assigned": 930
    },
    {
        "district": "진주시",
        "name": "공덕의집노인통합지원센터",
        "type": "재가노인복지시설",
        "address": "경남 진주시 의병로 65",
        "phone": "055-744-6556",
        "leader": "김은경",
        "staff_assigned": 48,
        "target_assigned": 720
    },
    {
        "district": "진주시",
        "name": "하늘마음노인통합지원센터",
        "type": "재가노인복지시설",
        "address": "경남 진주시 문산읍 월아산로 1116",
        "phone": "055-763-2553",
        "leader": "정희정",
        "staff_assigned": 48,
        "target_assigned": 720
    },
    {
        "district": "창녕군",
        "name": "창녕지역자활센터",
        "type": "지역자활센터",
        "address": "경상남도 창녕군 창녕읍 조산서재골로 7",
        "phone": "055-532-0612",
        "leader": "하승범",
        "staff_assigned": 80,
        "target_assigned": 1200
    },
    {
        "district": "창녕군",
        "name": "창녕군새누리노인종합센터",
        "type": "재가노인복지시설",
        "address": "경상남도 창녕군 남지읍 덕동길 55",
        "phone": "055-526-1796",
        "leader": "권미진",
        "staff_assigned": 80,
        "target_assigned": 1200
    },
    {
        "district": "창원시",
        "name": "동진노인통합지원센터",
        "type": "재가노인복지시설",
        "address": "경상남도 창원시 의창구 동읍 동읍로 517-14",
        "phone": "055-299-2233",
        "leader": "강외숙",
        "staff_assigned": 36,
        "target_assigned": 565
    },
    {
        "district": "창원시",
        "name": "창원도우누리노인통합재가센터",
        "type": "재가노인복지시설",
        "address": "경상남도 창원시 의창구 대봉로 26번길 4-5",
        "phone": "055-262-2773",
        "leader": "김미득",
        "staff_assigned": 52,
        "target_assigned": 805
    },
    {
        "district": "창원시",
        "name": "명진노인통합지원센터",
        "type": "재가노인복지시설",
        "address": "경상남도 창원시 마산합포구 구산면 마전길 335-1",
        "phone": "055-271-0483",
        "leader": "이형숙",
        "staff_assigned": 43,
        "target_assigned": 645
    },
    {
        "district": "창원시",
        "name": "마산희망지역자활센터",
        "type": "협동조합",
        "address": "경남 창원시 마산합포구 동서북7길 49",
        "phone": "070-4708-3402",
        "leader": "최미혜",
        "staff_assigned": 45,
        "target_assigned": 700
    },
    {
        "district": "창원시",
        "name": "경남노인통합지원센터",
        "type": "재가노인복지시설",
        "address": "경상남도 창원시 마산회원구 팔용로 272",
        "phone": "055-298-8602",
        "leader": "김양언",
        "staff_assigned": 47,
        "target_assigned": 730
    },
    {
        "district": "창원시",
        "name": "정현사회적협동조합",
        "type": "협동조합",
        "address": "경남 창원시 마산합포구 진동면 서촌길 7",
        "phone": "055-271-9913",
        "leader": "한연화",
        "staff_assigned": 55,
        "target_assigned": 829
    },
    {
        "district": "창원시",
        "name": "진해서부노인종합복지관",
        "type": "노인여가복지시설",
        "address": "경남 창원시 진해구 태평로 96",
        "phone": "055-547-8004",
        "leader": "조영순",
        "staff_assigned": 52,
        "target_assigned": 778
    },
    {
        "district": "창원시",
        "name": "진해노인종합복지관",
        "type": "노인여가복지시설",
        "address": "경남 창원시 진해구 천자로 434",
        "phone": "055-544-7155",
        "leader": "권현수",
        "staff_assigned": 46,
        "target_assigned": 715
    },
    {
        "district": "창원시",
        "name": "경남고용복지센터",
        "type": "사단법인",
        "address": "경남 창원시 성산구 원이대로 450",
        "phone": "055-261-8533",
        "leader": "정동화",
        "staff_assigned": 39,
        "target_assigned": 610
    },
    {
        "district": "창원시",
        "name": "마산회원노인종합복지관",
        "type": "사회복지관",
        "address": "경남 창원시 마산회원구 삼호로 227",
        "phone": "055-713-6890",
        "leader": "정응석",
        "staff_assigned": 29,
        "target_assigned": 431
    },
    {
        "district": "통영시",
        "name": "통영시종합사회복지관",
        "type": "사회복지관",
        "address": "경상남도 통영시 안개4길 94",
        "phone": "055-640-7700",
        "leader": "박철현",
        "staff_assigned": 63,
        "target_assigned": 945
    },
    {
        "district": "통영시",
        "name": "통영노인통합지원센터",
        "type": "재가노인복지시설",
        "address": "경남 통영시 동충1길 4",
        "phone": "055-641-6170",
        "leader": "조혜원",
        "staff_assigned": 77,
        "target_assigned": 1205
    },
    {
        "district": "하동군",
        "name": "하동노인통합지원센터",
        "type": "재가노인복지시설",
        "address": "경상남도 하동군 하동읍 중앙2길10-9",
        "phone": "055-884-7078",
        "leader": "이용백",
        "staff_assigned": 54,
        "target_assigned": 810
    },
    {
        "district": "하동군",
        "name": "경남하동지역자활센터",
        "type": "지역자활센터",
        "address": "경상남도 하동군 하동읍 청년회관길 13",
        "phone": "055-884-6955",
        "leader": "손호연",
        "staff_assigned": 52,
        "target_assigned": 780
    },
    {
        "district": "함안군",
        "name": "(사)대한노인회함안군지회",
        "type": "사단법인",
        "address": "경상남도 함안군 가야읍 중앙남길 67",
        "phone": "055-585-8505",
        "leader": "이학동",
        "staff_assigned": 69,
        "target_assigned": 1035
    },
    {
        "district": "함안군",
        "name": "함안군재가노인통합지원센터",
        "type": "재가노인복지시설",
        "address": "경상남도 함안군 칠서면 이룡3길 25-43",
        "phone": "055-586-1236",
        "leader": "진정옥",
        "staff_assigned": 69,
        "target_assigned": 1035
    },
    {
        "district": "함양군",
        "name": "사단법인 대한노인회 함양군지회",
        "type": "사단법인",
        "address": "경남 함양군 함양읍 함양남서로 1245 3층",
        "phone": "055-963-4165",
        "leader": "이영일",
        "staff_assigned": 96,
        "target_assigned": 1440
    },
    {
        "district": "합천군",
        "name": "미타재가복지센터",
        "type": "재가노인복지시설",
        "address": "경상남도 합천군 적중면 우회로 1198",
        "phone": "055-931-2233",
        "leader": "성병태",
        "staff_assigned": 48,
        "target_assigned": 720
    },
    {
        "district": "합천군",
        "name": "합천노인통합지원센터",
        "type": "재가노인복지시설",
        "address": "경상남도 합천군 삼가면 삼가로 10-13",
        "phone": "055-931-1014",
        "leader": "서문교",
        "staff_assigned": 64,
        "target_assigned": 960
    },
    {
        "district": "합천군",
        "name": "코끼리행복복지센터",
        "type": "재가노인복지시설",
        "address": "경남 합천군 가야면 가야시장로 98",
        "phone": "055-932-3141",
        "leader": "엄동수",
        "staff_assigned": 50,
        "target_assigned": 750
    },
    {
        "district": "합천군",
        "name": "사회적협동조합 합천지역자활센터",
        "type": "지역자활센터",
        "address": "경남 합천군 대양면 대야로 462",
        "phone": "055-933-3933",
        "leader": "심춘덕",
        "staff_assigned": 85,
        "target_assigned": 1275
    }
];

// Add jitter relative to district center
export const INSTITUTION_DATA = RAW_DATA.map((item, index) => {
    const center = DISTRICT_CENTERS[item.district] || [35.2279, 128.6811]; // Default to Changwon
    // Jitter: +/- 0.05 degrees (approx 5km)
    const jitterLat = (Math.random() - 0.5) * 0.08;
    const jitterLng = (Math.random() - 0.5) * 0.08;

    return {
        id: `inst-${index}`,
        ...item,
        lat: center[0] + jitterLat,
        lng: center[1] + jitterLng,
        social_worker_assigned: item.social_worker_assigned !== undefined
            ? item.social_worker_assigned
            : Math.max(1, Math.round((item.staff_assigned || 0) / 15)) // Fallback Simulation
    };
});
