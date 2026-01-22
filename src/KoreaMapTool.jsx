import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { INSTITUTION_DATA } from './data/institutionData';

// --- Icons (Inline SVG) ---
const IconMap = ({ size = 20, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6" /><line x1="9" x2="9" y1="3" y2="18" /><line x1="15" x2="15" y1="6" y2="21" />
    </svg>
);
const IconCheck = ({ size = 16, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
const IconSearch = ({ size = 16, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" />
    </svg>
);
const IconBuilding = ({ size = 16, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M8 10h.01" /><path d="M16 10h.01" /><path d="M8 14h.01" /><path d="M16 14h.01" />
    </svg>
);
const IconUsers = ({ size = 16, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);
const IconPhone = ({ size = 16, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);
const IconUpload = ({ size = 20, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);
const IconX = ({ size = 16, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

// --- Constants ---
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

const GYEONGNAM_DISTRICTS = {
    "창원시": { code: ["38110", "38111", "38112", "38113", "38114", "38115"], color: "#bfdbfe" }, // blue-200
    "진주시": { code: "38030", color: "#fde68a" }, // amber-200
    "통영시": { code: "38050", color: "#fbcfe8" }, // pink-200
    "사천시": { code: "38060", color: "#a5f3fc" }, // cyan-200
    "김해시": { code: "38070", color: "#a7f3d0" }, // emerald-200
    "밀양시": { code: "38080", color: "#fed7aa" }, // orange-200
    "거제시": { code: "38090", color: "#ddd6fe" }, // violet-200
    "양산시": { code: "38100", color: "#fecaca" }, // red-200
    "의령군": { code: "38310", color: "#fecdd3" }, // rose-200
    "함안군": { code: "38320", color: "#d9f99d" }, // lime-200
    "창녕군": { code: "38330", color: "#99f6e4" }, // teal-200
    "고성군": { code: "38340", color: "#e9d5ff" }, // purple-200
    "남해군": { code: "38350", color: "#f5d0fe" }, // fuchsia-200
    "하동군": { code: "38360", color: "#c7d2fe" }, // indigo-200
    "산청군": { code: "38370", color: "#fef08a" }, // yellow-200
    "함양군": { code: "38380", color: "#bbf7d0" }, // green-200
    "거창군": { code: "38390", color: "#e0e7ff" }, // indigo-100
    "합천군": { code: "38400", color: "#bae6fd" } // sky-200
};

// Facility Types for Filtering
const FACILITY_TYPES = [
    "사회복지관", "재가노인복지시설", "노인여가복지시설", "사회복지법인",
    "사단법인", "협동조합", "지역자활센터", "노인주거복지시설", "사회서비스원"
];

// Color mapping for facility types
const TYPE_COLORS = {
    "재가노인복지시설": "#3B82F6", // Blue
    "사회복지관": "#10B981", // Green
    "노인여가복지시설": "#F59E0B", // Amber
    "사회서비스원": "#EF4444", // Red
    "default": "#8B5CF6" // Purple
};

// Province (시도) data with center coordinates and colors
const PROVINCES = [
    { name: "서울특별시", center: [37.5665, 126.9780], zoom: 11, color: "#ef4444" },
    { name: "부산광역시", center: [35.1796, 129.0756], zoom: 11, color: "#f97316" },
    { name: "대구광역시", center: [35.8714, 128.6014], zoom: 11, color: "#eab308" },
    { name: "인천광역시", center: [37.4563, 126.7052], zoom: 11, color: "#84cc16" },
    { name: "광주광역시", center: [35.1595, 126.8526], zoom: 11, color: "#22c55e" },
    { name: "대전광역시", center: [36.3504, 127.3845], zoom: 11, color: "#14b8a6" },
    { name: "울산광역시", center: [35.5384, 129.3114], zoom: 11, color: "#06b6d4" },
    { name: "세종특별자치시", center: [36.4800, 127.2890], zoom: 11, color: "#0ea5e9" },
    { name: "경기도", center: [37.4138, 127.5183], zoom: 9, color: "#3b82f6" },
    { name: "강원도", center: [37.8228, 128.1555], zoom: 8, color: "#6366f1" },
    { name: "충청북도", center: [36.6357, 127.4912], zoom: 9, color: "#8b5cf6" },
    { name: "충청남도", center: [36.5184, 126.8000], zoom: 9, color: "#a855f7" },
    { name: "전라북도", center: [35.8203, 127.1088], zoom: 9, color: "#d946ef" },
    { name: "전라남도", center: [34.8679, 126.9910], zoom: 9, color: "#ec4899" },
    { name: "경상북도", center: [36.4919, 128.8889], zoom: 8, color: "#f43f5e" },
    { name: "경상남도", center: [35.2383, 128.6922], zoom: 9, color: "#10b981", hasData: true },
    { name: "제주특별자치도", center: [33.4890, 126.4983], zoom: 10, color: "#f59e0b" }
];

const KoreaMapTool = () => {
    // --- State ---
    const [isLeafletLoaded, setIsLeafletLoaded] = useState(false);
    const [districtGeoJsonData, setDistrictGeoJsonData] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // Data State (Supports upload)
    const [allData, setAllData] = useState(INSTITUTION_DATA);

    const [selectedProvince, setSelectedProvince] = useState(null); // Selected province (시도)
    const [selectedDistricts, setSelectedDistricts] = useState([]); // Array of selected district names. Empty = ALL
    const [selectedStructureType, setSelectedStructureType] = useState([]); // Array of selected types
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEntity, setSelectedEntity] = useState(null); // Clicked marker details

    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const districtLayerRef = useRef(null);
    const markerLayerGroupRef = useRef(null);
    const fileInputRef = useRef(null);

    // --- Data Parsing Logic ---
    const mapData = (rawRows) => {
        if (!rawRows || rawRows.length === 0) return [];

        // Helper to find key ignoring whitespace
        const findKey = (row, target) => {
            const keys = Object.keys(row);
            return keys.find(k => k.trim() === target) || target;
        };

        // Determine keys from the first row (assuming consistent structure)
        const firstRow = rawRows[0];
        const kDistrict = findKey(firstRow, '지자체');
        const kName = findKey(firstRow, '수행기관명');
        const kType = findKey(firstRow, '시설유형구분');
        const kAddress = findKey(firstRow, '주소');
        const kPhone = findKey(firstRow, '대표전화');
        const kLeader = findKey(firstRow, '기관장명');
        const kStaff = findKey(firstRow, '복지부배정_생활사');
        const kTarget = findKey(firstRow, '복지부배정_대상자');
        const kSocialWorker = findKey(firstRow, '복지부배정_전담사');

        console.log("Detected Keys:", { kDistrict, kName, kType, kAddress, kStaff, kTarget, kSocialWorker });

        return rawRows.map((row, i) => {
            const district = row[kDistrict] || '';
            const center = DISTRICT_CENTERS[district] || [35.2279, 128.6811];
            const jitterLat = (Math.random() - 0.5) * 0.08;
            const jitterLng = (Math.random() - 0.5) * 0.08;

            return {
                id: `inst-upload-${i}`,
                district: district,
                name: row[kName] || '',
                type: row[kType] || '',
                address: row[kAddress] || '',
                phone: row[kPhone] || '',
                leader: row[kLeader] || '',
                staff_assigned: parseInt(row[kStaff]) || 0,
                target_assigned: parseInt(row[kTarget]) || 0,
                social_worker_assigned: parseInt(row[kSocialWorker]) || 0,
                lat: center[0] + jitterLat,
                lng: center[1] + jitterLng
            };
        }).filter(item => {
            if (!item.district) console.warn("Filtered out item due to missing district:", item);
            return item.district;
        });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Use ArrayBuffer for robust XLSX reading
        const readerBuffer = new FileReader();
        readerBuffer.onload = (evt) => {
            try {
                const data = new Uint8Array(evt.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                // Now map data
                const finalData = mapData(jsonData);

                if (finalData.length > 0) {
                    setAllData(finalData);
                    alert(`데이터 ${finalData.length}건이 성공적으로 로드되었습니다.`);
                } else {
                    alert('데이터를 찾을 수 없습니다.');
                }
            } catch (err) {
                console.error(err);
                alert('파일 처리 중 오류가 발생했습니다.');
            }
        };
        readerBuffer.readAsArrayBuffer(file);
    };


    // Initial Data Filtering
    const filteredData = useMemo(() => {
        return allData.filter(item => {
            const matchDistrict = selectedDistricts.length === 0 || selectedDistricts.includes(item.district);
            const matchType = selectedStructureType.length === 0 || selectedStructureType.includes(item.type);
            const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.district.includes(searchTerm);

            if (searchTerm) {
                return matchSearch && matchType;
            }

            return matchDistrict && matchType && matchSearch;
        });
    }, [allData, selectedDistricts, selectedStructureType, searchTerm]);

    const totalTargetAssigned = filteredData.reduce((acc, curr) => acc + (parseInt(curr.target_assigned) || 0), 0);

    // Calculate counts for facility types (ignoring type filter to show available options)
    const typeCounts = useMemo(() => {
        const counts = {};
        FACILITY_TYPES.forEach(t => counts[t] = 0);

        allData.forEach(item => {
            const matchDistrict = selectedDistricts.length === 0 || selectedDistricts.includes(item.district);
            const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.district.includes(searchTerm);

            if (searchTerm) {
                if (matchSearch) counts[item.type] = (counts[item.type] || 0) + 1;
            } else {
                if (matchDistrict && matchSearch) {
                    counts[item.type] = (counts[item.type] || 0) + 1;
                }
            }
        });
        return counts;
    }, [selectedDistricts, searchTerm, allData]);

    // --- 1. Load Leaflet ---
    useEffect(() => {
        if (window.L && typeof window.L.map === 'function') {
            setIsLeafletLoaded(true);
            return;
        }
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = () => setIsLeafletLoaded(true);
        document.body.appendChild(script);
    }, []);

    // --- 2. Load GeoJSON ---
    useEffect(() => {
        fetch('https://raw.githubusercontent.com/southkorea/southkorea-maps/master/kostat/2013/json/skorea_municipalities_geo_simple.json')
            .then(res => res.json())
            .then(data => {
                setDistrictGeoJsonData(data);
                setIsLoadingData(false);
            })
            .catch(console.error);
    }, []);

    // --- 3. Initialize Map ---
    useEffect(() => {
        if (isLeafletLoaded && mapContainerRef.current && !mapInstanceRef.current && window.L) {
            const L = window.L;
            const map = L.map(mapContainerRef.current, {
                zoomControl: false,
                attributionControl: false
            }).setView([36.0, 127.8], 7); // Centered on Korea

            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            }).addTo(map);

            L.control.zoom({ position: 'topright' }).addTo(map);
            mapInstanceRef.current = map;
            markerLayerGroupRef.current = L.layerGroup().addTo(map);

            // Zoom Event Listener for Labels
            const handleZoom = () => {
                const zoom = map.getZoom();
                if (mapContainerRef.current) {
                    if (zoom >= 11) {
                        mapContainerRef.current.classList.add('show-labels');
                    } else {
                        mapContainerRef.current.classList.remove('show-labels');
                    }
                }
            };
            map.on('zoomend', handleZoom);
            // Initial check
            handleZoom();
        }
    }, [isLeafletLoaded]);

    // --- 4. Render Districts (Background) & Zoom Logic ---
    useEffect(() => {
        if (!mapInstanceRef.current || !districtGeoJsonData || !window.L) return;

        const L = window.L;
        const map = mapInstanceRef.current;

        if (districtLayerRef.current) map.removeLayer(districtLayerRef.current);

        // Use all features, or at least include non-Gyeongnam ones for context
        // But for performance with this specific file (simple), using all features is fine.
        // However, we still want to emphasize Gyeongnam.

        const allFeatures = districtGeoJsonData.features;

        // Find Gyeongnam district name from code
        const findDistrictName = (code) => {
            for (const [name, data] of Object.entries(GYEONGNAM_DISTRICTS)) {
                if (Array.isArray(data.code) ? data.code.includes(code) : data.code === code) return name;
            }
            return null;
        };

        // Find province name from feature properties
        const findProvinceName = (feature) => {
            const name = feature.properties.name || '';
            // Match province by name prefix
            for (const province of PROVINCES) {
                if (name.includes(province.name.replace(/특별시|광역시|특별자치시|특별자치도|도/g, '').substring(0, 2))) {
                    return province.name;
                }
            }
            // Fallback: check by code prefix
            const code = feature.properties.code || '';
            const codePrefix = code.substring(0, 2);
            const provinceCodeMap = {
                '11': '서울특별시', '21': '부산광역시', '22': '대구광역시', '23': '인천광역시',
                '24': '광주광역시', '25': '대전광역시', '26': '울산광역시', '29': '세종특별자치시',
                '31': '경기도', '32': '강원도', '33': '충청북도', '34': '충청남도',
                '35': '전라북도', '36': '전라남도', '37': '경상북도', '38': '경상남도',
                '39': '제주특별자치도'
            };
            return provinceCodeMap[codePrefix] || null;
        };

        // Render Layer
        districtLayerRef.current = L.geoJSON({ type: 'FeatureCollection', features: allFeatures }, {
            style: (feature) => {
                const gyeongnamDistrict = findDistrictName(feature.properties.code);
                const provinceName = findProvinceName(feature);
                const isGyeongnam = provinceName === '경상남도';

                // Find province color
                const province = PROVINCES.find(p => p.name === provinceName);
                const provinceColor = province?.color || '#e2e8f0';

                // If Gyeongnam is selected, show district-level details
                if (selectedProvince === '경상남도' && isGyeongnam) {
                    const isDistrictSelected = selectedDistricts.length === 0 ||
                        (gyeongnamDistrict && selectedDistricts.includes(gyeongnamDistrict));
                    return {
                        fillColor: gyeongnamDistrict ? (GYEONGNAM_DISTRICTS[gyeongnamDistrict]?.color || '#eee') : '#f1f5f9',
                        fillOpacity: isDistrictSelected ? 0.7 : 0.2,
                        color: '#64748b',
                        weight: isDistrictSelected && selectedDistricts.length > 0 ? 2 : 1,
                        opacity: 0.7
                    };
                }

                // If a province is selected (not Gyeongnam), highlight it
                if (selectedProvince && selectedProvince !== '경상남도') {
                    const isThisProvinceSelected = provinceName === selectedProvince;
                    return {
                        fillColor: isThisProvinceSelected ? provinceColor : '#f1f5f9',
                        fillOpacity: isThisProvinceSelected ? 0.7 : 0.15,
                        color: isThisProvinceSelected ? provinceColor : '#e2e8f0',
                        weight: isThisProvinceSelected ? 2 : 0.5,
                        opacity: isThisProvinceSelected ? 1 : 0.3
                    };
                }

                // Default: show all provinces with their colors
                return {
                    fillColor: provinceColor,
                    fillOpacity: 0.5,
                    color: '#94a3b8',
                    weight: 1,
                    opacity: 0.6
                };
            },
            onEachFeature: (feature, layer) => {
                const provinceName = findProvinceName(feature);
                const gyeongnamDistrict = findDistrictName(feature.properties.code);

                layer.on('click', () => {
                    // If in Gyeongnam detail mode, toggle district filter
                    if (selectedProvince === '경상남도' && gyeongnamDistrict) {
                        toggleDistrictFilter(gyeongnamDistrict);
                    } else if (provinceName) {
                        // Otherwise, select the province
                        setSelectedProvince(prev => prev === provinceName ? null : provinceName);
                    }
                });
            }
        }).addTo(map);

        districtLayerRef.current.bringToBack();

        // Zoom Logic
        if (selectedEntity) {
            // Do NOT change zoom if an entity is selected (user might be exploring)
            // or keep it centered on entity if that logic is elsewhere.
            // Actually, the user asked "maintain clicked screen".
            // We should skip auto-zoom here if selectedEntity is present BUT 
            // we usually want to zoom to the entity when it is clicked.
            // The issue is likely that this useEffect runs when selectedDistricts/searchTerm changes OR when filteredData changes.
            // Since filteredData is memoized now, stable.
            // But if selectedEntity changes, we might not want to re-run this ENTIRE effect if we can help it.
            // However, selectedEntity is NOT in the dependency array of THIS useEffect.
            // So this effect only runs on [districtGeoJsonData, selectedDistricts, searchTerm, filteredData].
            // If filteredData changes (e.g. search), we re-zoom. This is desired.
        } else if (searchTerm && filteredData.length > 0) {
            // If searching, fit bounds to the results (markers)
            const bounds = L.latLngBounds(filteredData.map(d => [d.lat, d.lng]));
            map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 0.5 });
        } else if (selectedDistricts.length > 0) {
            // If districts selected (and no active search overriding it), fit to districts
            const targetFeatures = allFeatures.filter(f => {
                const name = findDistrictName(f.properties.code);
                return selectedDistricts.includes(name);
            });

            if (targetFeatures.length > 0) {
                const group = L.featureGroup(targetFeatures.map(f => L.geoJSON(f)));
                map.fitBounds(group.getBounds(), { padding: [50, 50], animate: true, duration: 0.5 });
            }
        } else {
            // Reset view
            // If we want to show whole Korea, we might zoom out more, e.g. zoom 7
            // But user focuses on Gyeongnam usually.
            // Let's stick to Gyeongnam center but allow panning out.
            // map.setView([35.2383, 128.6922], 9, { animate: true, duration: 0.5 });
            // Actually, if "Korea Map is not visible", maybe we should zoom out a bit initially or just ensure it's pannable.
            // It is pannable. The issue was they were HIDDEN.
            // Now that we render `allFeatures`, they should be visible.

            // Check current center logic.
            // If we are just "resetting", 9 is fine for Gyeongnam.
            // If the user wants to see the whole country initially, 7 is better.
            // map.setView([36.5, 127.5], 7); // Approx center of Korea
        }

    }, [districtGeoJsonData, selectedDistricts, searchTerm, filteredData, selectedProvince]);

    // --- 5. Render Institution Markers ---
    useEffect(() => {
        if (!mapInstanceRef.current || !window.L) return;

        const L = window.L;
        const markerLayer = markerLayerGroupRef.current;
        markerLayer.clearLayers();

        filteredData.forEach(item => {
            const color = TYPE_COLORS[item.type] || TYPE_COLORS.default;
            const radius = 6 + Math.sqrt(item.target_assigned) * 0.15; // Dynamic sizing

            const marker = L.circleMarker([item.lat, item.lng], {
                radius: Math.min(radius, 20),
                fillColor: color,
                color: '#fff',
                weight: 1.5,
                opacity: 1,
                fillOpacity: 0.8
            });

            // Tooltip: Permanent but hidden via CSS until zoomed
            marker.bindTooltip(`
                <div class="text-xs font-bold text-slate-800 whitespace-nowrap inst-name-label">${item.name}</div>
            `, {
                direction: 'top',
                offset: [0, -10],
                permanent: true,
                className: 'inst-tooltip-container',
                opacity: 1
            });

            marker.on('click', () => {
                setSelectedEntity(item);
                mapInstanceRef.current.setView([item.lat, item.lng], 13);
            });

            markerLayer.addLayer(marker);
        });

    }, [filteredData]);


    // --- Helper Functions ---
    const toggleTypeFilter = (type) => {
        setSelectedStructureType(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const toggleDistrictFilter = (district) => {
        setSelectedDistricts(prev =>
            prev.includes(district) ? prev.filter(d => d !== district) : [...prev, district]
        );
    };

    return (
        <div className="flex flex-col h-screen bg-white text-slate-800 font-sans overflow-hidden">
            {/* Header */}
            <header className="bg-indigo-900 text-white p-4 shadow-md shrink-0 flex items-center justify-between z-20">
                <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-lg">
                        <IconMap size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">경남 사회서비스 기관 현황</h1>
                        <p className="text-xs text-indigo-200">Gyeongnam Social Service Dashboard</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".csv, .xlsx, .xls"
                    />
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-indigo-800 hover:bg-indigo-700 rounded text-xs text-indigo-100 transition-colors border border-indigo-700"
                        title="데이터(Excel/CSV) 업로드"
                    >
                        <IconUpload size={14} />
                        <span>데이터 업로드</span>
                    </button>
                    <div className="text-right hidden md:block border-l border-indigo-800 pl-4">
                        <div className="text-2xl font-bold text-yellow-400">{filteredData.length} <span className="text-sm font-normal text-white">개소</span></div>
                        <div className="text-xs text-indigo-300">표시된 기관 수</div>
                    </div>
                </div>
            </header>

            {/* Main Layout: 3 Columns (Left Control, Center Map, Right Detail) */}
            <main className="flex-1 flex overflow-hidden">

                {/* 1. Left Panel : Controls & Filter (w-64) */}
                <div className="w-80 bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto custom-scrollbar shadow-lg z-10">
                    <div className="p-4 space-y-6">
                        {/* Search */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="기관명, 주소 검색"
                                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <IconSearch className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        </div>

                        {/* Summary Card */}
                        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                            <h3 className="text-xs font-bold text-indigo-800 uppercase mb-2">총 배정 대상자</h3>
                            <div className="flex items-end gap-1">
                                <IconUsers className="mb-1 text-indigo-600" />
                                <span className="text-2xl font-extrabold text-indigo-900">{totalTargetAssigned.toLocaleString()}</span>
                                <span className="text-xs text-indigo-600 mb-1.5">명</span>
                            </div>
                        </div>

                        {/* District Filter */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-slate-800 flex justify-between items-center">
                                지역 선택
                                {selectedDistricts.length > 0 &&
                                    <button onClick={() => setSelectedDistricts([])} className="text-xs text-blue-500 hover:text-blue-700">초기화</button>
                                }
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => setSelectedDistricts([])}
                                    className={`px-2 py-1.5 text-xs rounded border transition-colors ${selectedDistricts.length === 0 ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                >
                                    전체
                                </button>
                                {Object.keys(GYEONGNAM_DISTRICTS).map(d => (
                                    <button
                                        key={d}
                                        onClick={() => toggleDistrictFilter(d)}
                                        className={`px-2 py-1.5 text-xs rounded border transition-colors truncate ${selectedDistricts.includes(d) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Type Filter */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-slate-800">시설 유형</h3>
                            <div className="flex flex-col gap-1.5">
                                {FACILITY_TYPES.map(type => (
                                    <label key={type} className="flex items-center gap-2 cursor-pointer group p-1.5 rounded hover:bg-gray-50 transition-colors">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedStructureType.includes(type) ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}>
                                            {selectedStructureType.includes(type) && <IconCheck size={12} className="text-white" />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={selectedStructureType.includes(type)}
                                            onChange={() => toggleTypeFilter(type)}
                                        />
                                        <span className={`text-sm ${selectedStructureType.includes(type) ? 'text-indigo-900 font-medium' : 'text-gray-600'}`}>
                                            {type} <span className="text-xs text-gray-400 font-normal">({typeCounts[type] || 0})</span>
                                        </span>
                                        <div className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: TYPE_COLORS[type] || TYPE_COLORS.default }}></div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Center Panel : Map (Flex-1) */}
                <div className="flex-1 relative bg-slate-100">
                    <div ref={mapContainerRef} className="w-full h-full z-0 outline-none"></div>

                    {/* Floating Legend */}
                    <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur shadow-lg border border-gray-100 rounded-lg p-3 z-[400] text-xs">
                        <div className="font-bold mb-2 text-slate-700">시설 유형 범례</div>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#3B82F6]"></span>
                                <span>재가노인복지시설</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#10B981]"></span>
                                <span>사회복지관</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#EF4444]"></span>
                                <span>사회서비스원</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#8B5CF6]"></span>
                                <span>기타 시설</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Right Panel : Details (w-80) */}
                {selectedEntity ? (
                    <div className="w-80 bg-white border-l border-gray-200 flex flex-col shrink-0 shadow-xl z-20 animate-slide-in-right">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-start bg-indigo-50/50">
                            <div>
                                <span className="inline-block px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold mb-2 border border-indigo-200">
                                    {selectedEntity.district}
                                </span>
                                <h2 className="text-lg font-bold text-slate-900 leading-tight">{selectedEntity.name}</h2>
                                <p className="text-xs text-gray-500 mt-1">{selectedEntity.type}</p>
                            </div>
                            <button onClick={() => setSelectedEntity(null)} className="text-gray-400 hover:text-gray-600"><IconX size={20} /></button>
                        </div>

                        <div className="p-5 flex-1 overflow-y-auto space-y-6">
                            {/* Basic Info */}
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <IconBuilding size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-500 font-semibold uppercase">주소</p>
                                        <p className="text-sm text-slate-700 mt-0.5 leading-snug">{selectedEntity.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <IconPhone size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-500 font-semibold uppercase">연락처</p>
                                        <p className="text-sm text-slate-700 mt-0.5 font-mono">{selectedEntity.phone}</p>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Assignments */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 mb-3">배정 현황</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 col-span-2">
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-blue-600 font-bold">배정 대상자</p>
                                            <p className="text-lg font-bold text-blue-700">{selectedEntity.target_assigned}<span className="text-xs font-normal text-blue-500 ml-1">명</span></p>
                                        </div>
                                    </div>
                                    <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                                        <p className="text-[11px] text-indigo-600 font-bold truncate">전담사회복지사</p>
                                        <p className="text-lg font-bold text-indigo-700 mt-0.5">{selectedEntity.social_worker_assigned}<span className="text-xs font-normal text-indigo-500 ml-1">명</span></p>
                                    </div>
                                    <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                                        <p className="text-[11px] text-emerald-600 font-bold truncate">생활지원사</p>
                                        <p className="text-lg font-bold text-emerald-700 mt-0.5">{selectedEntity.staff_assigned}<span className="text-xs font-normal text-emerald-500 ml-1">명</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-4">
                                <div className="flex justify-between text-xs py-1">
                                    <span className="text-gray-500">기관장</span>
                                    <span className="font-medium text-slate-800">{selectedEntity.leader}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
                            <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-bold shadow-sm transition-colors">
                                상세 리포트 보기
                            </button>
                        </div>
                    </div>
                ) : selectedProvince === "경상남도" ? (
                    <div className="w-80 bg-white border-l border-gray-200 hidden md:flex flex-col shrink-0 z-10">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-sm font-bold text-slate-700">기관 목록 ({filteredData.length})</h2>
                            <button
                                onClick={() => {
                                    setSelectedProvince(null);
                                    if (mapInstanceRef.current) mapInstanceRef.current.setView([36.0, 127.8], 7);
                                }}
                                className="text-xs text-indigo-600 hover:text-indigo-800"
                            >
                                ← 시도 선택
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                            {filteredData.map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        setSelectedEntity(item);
                                        if (mapInstanceRef.current) mapInstanceRef.current.setView([item.lat, item.lng], 13);
                                    }}
                                    className="p-3 bg-white border border-gray-100 rounded-lg hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all active:scale-[0.98]"
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{item.district}</span>
                                        <span className="text-[10px] text-gray-400">{item.type}</span>
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-800 truncate">{item.name}</h3>
                                    <p className="text-xs text-slate-500 mt-1 truncate">{item.address}</p>
                                    <div className="flex gap-2 mt-2 text-[10px] text-gray-500">
                                        <span className="flex items-center gap-1"><IconUsers size={10} /> 대상 {item.target_assigned}</span>
                                        <span className="flex items-center gap-1">전담 {item.staff_assigned}</span>
                                    </div>
                                </div>
                            ))}
                            {filteredData.length === 0 && (
                                <div className="text-center py-10 text-gray-400 text-sm">
                                    검색 결과가 없습니다.
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="w-80 bg-white border-l border-gray-200 hidden md:flex flex-col shrink-0 z-10">
                        <div className="p-4 border-b border-gray-100">
                            <h2 className="text-sm font-bold text-slate-700">시도 선택</h2>
                            <p className="text-xs text-gray-400 mt-1">지역을 선택하세요</p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                            {PROVINCES.map(province => (
                                <div
                                    key={province.name}
                                    onClick={() => {
                                        setSelectedProvince(province.name);
                                        if (mapInstanceRef.current) {
                                            mapInstanceRef.current.setView(province.center, province.zoom);
                                        }
                                    }}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all active:scale-[0.98] ${province.hasData
                                        ? 'bg-indigo-50 border-indigo-200 hover:border-indigo-400 hover:shadow-md'
                                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className={`text-sm font-bold ${province.hasData ? 'text-indigo-700' : 'text-gray-600'}`}>
                                            {province.name}
                                        </span>
                                        {province.hasData && (
                                            <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full">데이터 있음</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </main>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 2px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
                @keyframes slide-in-right {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
                
                /* Label Visibility Control */
                .inst-tooltip-container {
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .inst-tooltip-container:before {
                    display: none;
                }
                .show-labels .inst-tooltip-container {
                    opacity: 1;
                }
                .inst-name-label {
                    text-shadow: -2px 0 #fff, 0 2px #fff, 2px 0 #fff, 0 -2px #fff;
                    font-size: 11px;
                }
            `}</style>
        </div>
    );
};

export default KoreaMapTool;
