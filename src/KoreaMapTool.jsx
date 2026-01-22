import React, { useState, useEffect, useRef } from 'react';

// --- 아이콘 컴포넌트 (Inline SVG) ---
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
const IconCopy = ({ size = 16, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
);
const IconRefresh = ({ size = 16, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" />
    </svg>
);
const IconLayers = ({ size = 16, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
    </svg>
);
const IconLoader = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${className} animate-spin`}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);
const IconInfo = ({ size = 16, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
    </svg>
);

// --- 상수 및 데이터 ---

// GeoJSON 매핑 (2013년 데이터 기준)
const NAME_MAPPING = {
    "서울특별시": "seoul",
    "인천광역시": "incheon",
    "경기도": "gyeonggi",
    "강원도": "gangwon",
    "충청북도": "chungbuk",
    "충청남도": "chungnam",
    "대전광역시": "daejeon",
    "세종특별자치시": "sejong",
    "전라북도": "jeonbuk",
    "전라남도": "jeonnam",
    "광주광역시": "gwangju",
    "경상북도": "gyeongbuk",
    "대구광역시": "daegu",
    "경상남도": "gyeongnam",
    "부산광역시": "busan",
    "울산광역시": "ulsan",
    "제주특별자치도": "jeju"
};

const DEFAULT_COLORS = {
    seoul: "#EF4444", incheon: "#3B82F6", gyeonggi: "#60A5FA",
    gangwon: "#10B981", chungbuk: "#F59E0B", chungnam: "#F97316",
    daejeon: "#8B5CF6", sejong: "#A855F7", jeonbuk: "#EC4899",
    jeonnam: "#DB2777", gwangju: "#D946EF", gyeongbuk: "#34D399",
    daegu: "#10B981", gyeongnam: "#6EE7B7", busan: "#059669",
    ulsan: "#047857", jeju: "#FBBF24"
};

const KoreaMapTool = () => {
    // --- 상태 관리 ---
    const [isLeafletLoaded, setIsLeafletLoaded] = useState(false);
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState(null);

    const [viewMode, setViewMode] = useState('individual');
    const [mergeColor, setMergeColor] = useState('#FF7F50');
    const [opacity, setOpacity] = useState(0.7);
    const [mapStyle, setMapStyle] = useState('simple');
    const [copied, setCopied] = useState(false);

    // 지역별 설정 (선택 여부 및 색상)
    const [regionSettings, setRegionSettings] = useState(() => {
        const initial = {};
        Object.keys(DEFAULT_COLORS).forEach(key => {
            initial[key] = {
                selected: ['daejeon', 'sejong', 'chungnam', 'chungbuk'].includes(key),
                color: DEFAULT_COLORS[key]
            };
        });
        return initial;
    });

    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const geoJsonLayerRef = useRef(null);
    const tileLayerRef = useRef(null);

    // --- 1. Leaflet 라이브러리 동적 로드 ---
    useEffect(() => {
        if (window.L && typeof window.L.map === 'function') {
            setIsLeafletLoaded(true);
            return;
        }

        const loadScript = () => {
            if (!document.querySelector('link[href*="leaflet.css"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);
            }

            if (!document.querySelector('script[src*="leaflet.js"]')) {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.async = true;
                script.onload = () => {
                    setTimeout(() => setIsLeafletLoaded(true), 100);
                };
                script.onerror = () => setError("지도 엔진을 불러오는 데 실패했습니다.");
                document.body.appendChild(script);
            } else {
                const checkL = setInterval(() => {
                    if (window.L && typeof window.L.map === 'function') {
                        clearInterval(checkL);
                        setIsLeafletLoaded(true);
                    }
                }, 500);
            }
        };

        loadScript();
    }, []);

    // --- 2. GeoJSON 데이터 가져오기 ---
    useEffect(() => {
        fetch('https://raw.githubusercontent.com/southkorea/southkorea-maps/master/kostat/2013/json/skorea_provinces_geo_simple.json')
            .then(response => {
                if (!response.ok) throw new Error("데이터 로딩 실패");
                return response.json();
            })
            .then(data => {
                setGeoJsonData(data);
                setIsLoadingData(false);
            })
            .catch(err => {
                console.error(err);
                setError("지도 데이터를 불러오는 중 오류가 발생했습니다.");
                setIsLoadingData(false);
            });
    }, []);

    // --- 3. 지도 초기화 ---
    useEffect(() => {
        if (isLeafletLoaded && mapContainerRef.current && !mapInstanceRef.current && window.L) {
            try {
                const L = window.L;
                const map = L.map(mapContainerRef.current, {
                    zoomControl: false,
                    attributionControl: false
                }).setView([36.3, 127.8], 7);

                L.control.zoom({ position: 'topright' }).addTo(map);

                tileLayerRef.current = L.tileLayer('', { attribution: '' }).addTo(map);
                mapInstanceRef.current = map;
            } catch (e) {
                console.error("Map initialization error:", e);
                setError("지도 초기화 중 오류가 발생했습니다.");
            }
        }
    }, [isLeafletLoaded]);

    // --- 4. 타일 스타일 업데이트 ---
    useEffect(() => {
        if (!mapInstanceRef.current || !tileLayerRef.current) return;

        const url = mapStyle === 'standard'
            ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

        tileLayerRef.current.setUrl(url);
    }, [mapStyle, isLeafletLoaded]);

    // --- 5. GeoJSON 레이어 렌더링 ---
    useEffect(() => {
        if (!mapInstanceRef.current || !geoJsonData || !window.L) return;

        const L = window.L;
        const map = mapInstanceRef.current;

        if (geoJsonLayerRef.current) {
            map.removeLayer(geoJsonLayerRef.current);
        }

        const style = (feature) => {
            const name = feature.properties.name;
            const key = NAME_MAPPING[name];
            const setting = regionSettings[key];

            if (!setting || !setting.selected) {
                return {
                    fillOpacity: 0,
                    opacity: 0,
                    interactive: false
                };
            }

            const isMerged = viewMode === 'merged';
            const fillColor = isMerged ? mergeColor : setting.color;
            const color = isMerged ? mergeColor : 'white';
            const weight = isMerged ? 2 : 1.5;

            return {
                fillColor: fillColor,
                fillOpacity: opacity,
                color: color,
                weight: weight,
                opacity: 1,
            };
        };

        try {
            geoJsonLayerRef.current = L.geoJSON(geoJsonData, {
                style: style,
                onEachFeature: (feature, layer) => {
                    const name = feature.properties.name;

                    layer.bindTooltip(
                        `<div class="font-bold text-sm font-sans">${name}</div>`,
                        { sticky: true, direction: 'top', className: 'bg-transparent border-0 shadow-none text-slate-800' }
                    );

                    layer.on('click', () => {
                        const key = NAME_MAPPING[name];
                        if (key) toggleRegion(key);
                    });

                    layer.on('mouseover', function () {
                        const key = NAME_MAPPING[name];
                        if (regionSettings[key] && regionSettings[key].selected) {
                            this.setStyle({ fillOpacity: Math.min(opacity + 0.2, 1) });
                        }
                    });
                    layer.on('mouseout', function () {
                        const key = NAME_MAPPING[name];
                        if (regionSettings[key] && regionSettings[key].selected) {
                            this.setStyle({ fillOpacity: opacity });
                        }
                    });
                }
            }).addTo(map);

            geoJsonLayerRef.current.bringToFront();
        } catch (e) {
            console.error("GeoJSON rendering error:", e);
        }

    }, [geoJsonData, viewMode, mergeColor, regionSettings, opacity, isLeafletLoaded]);


    // --- 핸들러 ---
    const toggleRegion = (key) => {
        setRegionSettings(prev => ({
            ...prev,
            [key]: { ...prev[key], selected: !prev[key].selected }
        }));
    };

    const changeRegionColor = (key, newColor) => {
        setRegionSettings(prev => ({
            ...prev,
            [key]: { ...prev[key], color: newColor }
        }));
    };

    const toggleAll = (selectAll) => {
        setRegionSettings(prev => {
            const next = {};
            Object.keys(prev).forEach(key => {
                next[key] = { ...prev[key], selected: selectAll };
            });
            return next;
        });
    };

    const generatePrompt = () => {
        const activeRegions = Object.entries(regionSettings)
            .filter(([, s]) => s.selected)
            .map(([key]) => {
                const found = Object.keys(NAME_MAPPING).find(name => NAME_MAPPING[name] === key);
                return { key, name: found || key };
            });

        if (activeRegions.length === 0) return "선택된 지역이 없습니다.";

        // 그룹 정의: 대전/충남/충북 = 그룹1, 세종 = 그룹2
        const group1Keys = ['daejeon', 'chungnam', 'chungbuk'];
        const group2Keys = ['sejong'];

        const group1Regions = activeRegions.filter(r => group1Keys.includes(r.key));
        const group2Regions = activeRegions.filter(r => group2Keys.includes(r.key));
        const otherRegions = activeRegions.filter(r => !group1Keys.includes(r.key) && !group2Keys.includes(r.key));

        const styleText = mapStyle === 'simple'
            ? "minimalist vector map style with clean white background"
            : "realistic map style with terrain details";

        let prompt = `A high-quality map of South Korea. Style: ${styleText}. `;

        // 그룹별 설명 생성
        if (group1Regions.length > 0 || group2Regions.length > 0) {
            prompt += `The map highlights two distinct regional groups: `;

            if (group1Regions.length > 0) {
                const group1Names = group1Regions.map(r => r.name).join(', ');
                const group1Color = viewMode === 'merged' ? mergeColor : regionSettings[group1Regions[0].key]?.color || '#F97316';
                prompt += `GROUP 1 (충청권 - ${group1Names}) shown as a UNIFIED single region filled with ${group1Color} color, internal borders removed to appear as one cohesive area; `;
            }

            if (group2Regions.length > 0) {
                const group2Names = group2Regions.map(r => r.name).join(', ');
                const group2Color = viewMode === 'merged' ? mergeColor : regionSettings[group2Regions[0].key]?.color || '#A855F7';
                prompt += `GROUP 2 (${group2Names}) highlighted SEPARATELY with ${group2Color} color, distinctly visible as an independent region. `;
            }
        }

        // 기타 선택된 지역
        if (otherRegions.length > 0) {
            const otherNames = otherRegions.map(r => r.name).join(', ');
            prompt += `Additional highlighted regions: ${otherNames}. `;
        }

        prompt += `High precision GeoJSON boundaries, no overlapping artifacts, professional cartographic quality. Opacity: ${Math.round(opacity * 100)}%.`;

        return prompt;
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatePrompt());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col h-screen bg-white text-slate-800 font-sans overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 p-4 shadow-sm flex items-center justify-between shrink-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-lg text-white">
                        <IconMap size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Korea Map Master Pro</h1>
                        <p className="text-xs text-gray-500">정밀 GeoJSON 기반 전국 시도 커스텀 지도</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setMapStyle(mapStyle === 'standard' ? 'simple' : 'standard')}
                        className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 flex items-center gap-2"
                    >
                        <IconLayers size={14} />
                        {mapStyle === 'standard' ? '위성/도로' : '심플 배경'}
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                {/* Map Area */}
                <div className="flex-1 bg-slate-100 relative h-[50vh] md:h-auto group">
                    <div ref={mapContainerRef} className="w-full h-full z-0"></div>

                    {/* Loading Indicator */}
                    {(!isLeafletLoaded || isLoadingData) && (
                        <div className="absolute inset-0 bg-white/80 z-[1000] flex flex-col items-center justify-center backdrop-blur-sm">
                            <IconLoader className="w-10 h-10 text-indigo-600 mb-4" />
                            <p className="text-sm font-semibold text-gray-600">
                                {!isLeafletLoaded ? '지도 엔진 로딩 중...' : '고해상도 지도 데이터 불러오는 중...'}
                            </p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="absolute inset-0 bg-white/95 z-[1000] flex flex-col items-center justify-center p-6 text-center">
                            <div className="text-red-500 text-lg font-bold mb-2">오류 발생</div>
                            <p className="text-sm text-gray-600 mb-4">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm font-bold"
                            >
                                새로고침
                            </button>
                        </div>
                    )}

                    {/* Legend Overlay */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md z-[500] text-xs max-w-[200px] border border-gray-100 transition-opacity opacity-100 group-hover:opacity-100 md:opacity-90 pointer-events-none">
                        <div className="font-bold mb-1 text-slate-700">지도 상태</div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-gray-500">모드</span>
                            <span className="font-medium text-indigo-600">{viewMode === 'merged' ? '통합 (Merged)' : '개별 (Individual)'}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 mt-1">
                            <span className="text-gray-500">선택</span>
                            <span className="font-medium text-slate-800">{Object.values(regionSettings).filter(r => r.selected).length}개 지역</span>
                        </div>
                    </div>
                </div>

                {/* Controls Sidebar */}
                <div className="w-full md:w-96 bg-white border-l border-gray-200 flex flex-col h-[50vh] md:h-auto z-10 shadow-xl">

                    {/* Top Controls */}
                    <div className="p-5 border-b border-gray-100 bg-gray-50 space-y-4 shrink-0">
                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-2 block flex justify-between items-center">
                                <span>시각화 모드</span>
                                <div className="group relative">
                                    <IconInfo size={14} className="text-gray-400 cursor-help" />
                                    <div className="absolute right-0 w-48 p-2 bg-slate-800 text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 mt-1">
                                        '통합' 모드는 선택된 지역의 경계선을 지워 하나의 권역처럼 표시합니다.
                                    </div>
                                </div>
                            </label>
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setViewMode('individual')}
                                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${viewMode === 'individual' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    개별 색상
                                </button>
                                <button
                                    onClick={() => setViewMode('merged')}
                                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${viewMode === 'merged' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    통합 묶기
                                </button>
                            </div>
                        </div>

                        {viewMode === 'merged' && (
                            <div className="animate-fade-in transition-all duration-300">
                                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">통합 그룹 색상</label>
                                <div className="flex gap-2 items-center">
                                    <div className="relative w-8 h-8">
                                        <input
                                            type="color"
                                            value={mergeColor}
                                            onChange={(e) => setMergeColor(e.target.value)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div
                                            className="w-full h-full rounded border shadow-sm transition-colors"
                                            style={{ backgroundColor: mergeColor }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500">선택된 지역들이 이 색상으로 통일됩니다.</span>
                                </div>
                            </div>
                        )}

                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-xs font-semibold text-gray-600">영역 투명도</label>
                                <span className="text-xs text-gray-500">{Math.round(opacity * 100)}%</span>
                            </div>
                            <input
                                type="range" min="0.1" max="1.0" step="0.1"
                                value={opacity}
                                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                                className="w-full accent-indigo-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Region List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                        <div className="flex justify-between items-center px-3 py-2 border-b border-gray-100 mb-2 sticky top-0 bg-white z-10">
                            <span className="text-xs font-bold text-gray-500 uppercase">지역 선택</span>
                            <div className="flex gap-2">
                                <button onClick={() => toggleAll(true)} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors">전체 선택</button>
                                <button onClick={() => toggleAll(false)} className="text-[10px] bg-gray-50 text-gray-600 px-2 py-1 rounded hover:bg-gray-100 transition-colors">해제</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-1 pb-4">
                            {Object.keys(DEFAULT_COLORS).map((key) => {
                                const koreanName = Object.keys(NAME_MAPPING).find(name => NAME_MAPPING[name] === key) || key;
                                const setting = regionSettings[key];

                                return (
                                    <div key={key} className={`flex items-center justify-between p-2 rounded-lg border transition-all ${setting.selected ? 'bg-indigo-50 border-indigo-100 shadow-sm' : 'bg-white border-transparent hover:bg-gray-50'}`}>
                                        <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => toggleRegion(key)}>
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${setting.selected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}>
                                                {setting.selected && <IconCheck size={12} className="text-white" />}
                                            </div>
                                            <span className={`text-sm ${setting.selected ? 'font-bold text-indigo-900' : 'text-gray-600'}`}>{koreanName}</span>
                                        </div>

                                        <div className="flex items-center gap-2 relative w-6 h-6" title="개별 색상 변경">
                                            <input
                                                type="color"
                                                value={setting.color}
                                                onChange={(e) => changeRegionColor(key, e.target.value)}
                                                disabled={viewMode === 'merged'}
                                                className={`absolute inset-0 w-full h-full opacity-0 z-10 ${viewMode === 'merged' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                            />
                                            <div
                                                className={`w-full h-full rounded-full border shadow-sm ring-1 ring-black/5 transition-opacity ${viewMode === 'merged' ? 'opacity-30' : 'opacity-100'}`}
                                                style={{ backgroundColor: setting.color }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default KoreaMapTool;
