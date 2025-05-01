import { useRef, useState, useEffect } from 'react';

// Dữ liệu mẫu cho flashcard
const sampleFlashcards = [
  {
    id: 1,
    imageUrl: "https://placehold.co/1024x1536/E0E0E0/333333?text=Flashcard+1",
    isFavorite: false,
    // Thêm thông tin từ vựng
    vocabulary: {
      word: "Serendipity",
      meaning: "Tình cờ tìm thấy điều tốt đẹp khi không tìm kiếm nó",
      example: "Her discovery of the old photograph was a case of pure serendipity.",
      phrases: ["Happy serendipity", "Pure serendipity"],
      popularity: "Trung bình",
      synonyms: ["Luck", "Chance", "Fortune"],
      antonyms: ["Misfortune", "Design", "Plan"]
    }
  },
  {
    id: 2,
    imageUrl: "https://placehold.co/1024x1536/D0D0D0/333333?text=Flashcard+2",
    isFavorite: true,
    vocabulary: {
      word: "Ephemeral",
      meaning: "Tồn tại trong thời gian ngắn, thoáng qua",
      example: "The beauty of cherry blossoms is ephemeral, lasting only a few days.",
      phrases: ["Ephemeral joy", "Ephemeral beauty"],
      popularity: "Thấp",
      synonyms: ["Fleeting", "Temporary", "Transient"],
      antonyms: ["Permanent", "Enduring", "Eternal"]
    }
  },
  {
    id: 3,
    imageUrl: "https://placehold.co/1024x1536/C0C0C0/333333?text=Flashcard+3",
    isFavorite: false,
    vocabulary: {
      word: "Ubiquitous",
      meaning: "Hiện diện khắp nơi hoặc dường như hiện diện khắp nơi",
      example: "Smartphones have become ubiquitous in modern society.",
      phrases: ["Ubiquitous technology", "Ubiquitous presence"],
      popularity: "Cao",
      synonyms: ["Omnipresent", "Universal", "Pervasive"],
      antonyms: ["Rare", "Limited", "Scarce"]
    }
  },
  {
    id: 4,
    imageUrl: "https://placehold.co/1024x1536/B0B0B0/333333?text=Flashcard+4",
    isFavorite: true,
    vocabulary: {
      word: "Quintessential",
      meaning: "Đại diện hoàn hảo cho một loại, phẩm chất hoặc đặc điểm nhất định",
      example: "Paris is the quintessential romantic city.",
      phrases: ["Quintessential example", "Quintessential feature"],
      popularity: "Trung bình",
      synonyms: ["Classic", "Typical", "Perfect"],
      antonyms: ["Atypical", "Uncharacteristic", "Unusual"]
    }
  },
  {
    id: 5,
    imageUrl: "https://placehold.co/1024x1536/A0A0A0/333330?text=Flashcard+5",
    isFavorite: false,
    vocabulary: {
      word: "Resilience",
      meaning: "Khả năng phục hồi nhanh chóng sau khó khăn",
      example: "Her resilience helped her overcome many obstacles in life.",
      phrases: ["Show resilience", "Build resilience"],
      popularity: "Cao",
      synonyms: ["Toughness", "Adaptability", "Strength"],
      antonyms: ["Fragility", "Weakness", "Vulnerability"]
    }
  }
];

// Animation cho toast và settings modal
const animations = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(-10px); }
    10% { opacity: 1; transform: translateY(0); }
    90% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-10px); }
  }

  @keyframes slideIn {
    0% { transform: translateY(20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }

  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  @keyframes scaleIn {
    0% { transform: scale(0.95); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }

  /* Animation mới cho backdrop */
  @keyframes modalBackdropIn {
    0% { opacity: 0; }
    100% { opacity: 0.4; } /* Sử dụng giá trị 0.4 theo yêu cầu */
  }

  /* Animation mới cho modal (được yêu cầu thêm nhưng không dùng trong code settings mới) */
  @keyframes modalIn {
    0% { opacity: 0; transform: scale(0.95) translateY(10px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }

  /* Adding style-specific animations */
  @keyframes animeSparkle {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }

  @keyframes comicPop {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  @keyframes realisticShine {
    0% { background-position: -100% 0; }
    100% { background-position: 200% 0; }
  }
`;

export default function VerticalFlashcardGallery() {
  const scrollContainerRef = useRef(null);
  const [flashcards, setFlashcards] = useState(sampleFlashcards);
  const [isSettingsHovered, setIsSettingsHovered] = useState(false);
  const [showFavoriteToast, setShowFavoriteToast] = useState(false);
  const [activeTab, setActiveTab] = useState('collection'); // 'collection' or 'favorite'
  const [showSettings, setShowSettings] = useState(false);
  const [layoutMode, setLayoutMode] = useState('single'); // 'single' or 'double'

  // Add a new state variable for visual style
  const [visualStyle, setVisualStyle] = useState('default'); // 'default', 'anime', 'comic', or 'realistic'

  // Add this after the visualStyle state
  const [imageDetail, setImageDetail] = useState('basic'); // 'basic', 'phrase', or 'example'

  // Thêm state để quản lý modal từ vựng
  const [showVocabDetail, setShowVocabDetail] = useState(false);
  const [selectedVocab, setSelectedVocab] = useState(null);


  // Lọc flashcard dựa trên tab đang active
  const filteredFlashcards = activeTab === 'collection'
    ? flashcards
    : flashcards.filter(card => card.isFavorite);

  const favoriteCount = flashcards.filter(card => card.isFavorite).length;
  const totalFlashcards = flashcards.length;

  const toggleFavorite = (id) => {
    setFlashcards(prevCards =>
      prevCards.map(card =>
        card.id === id
          ? { ...card, isFavorite: !card.isFavorite }
          : card
      )
    );

    // Hiển thị toast thông báo
    setShowFavoriteToast(true);
    setTimeout(() => setShowFavoriteToast(false), 2000);
  };

  // Tạo hàm để mở modal từ vựng
  const openVocabDetail = (card) => {
    setSelectedVocab(card.vocabulary);
    setShowVocabDetail(true);
  };

  // Loại bỏ useEffect để đóng settings khi click ra ngoài
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     const settingsPanel = document.getElementById('settings-panel');
  //     const settingsButton = document.getElementById('settings-button');

  //     // Kiểm tra xem click có nằm ngoài panel và không phải là nút mở panel hay không
  //     if (showSettings && settingsPanel && !settingsPanel.contains(event.target) &&
  //         settingsButton && !settingsButton.contains(event.target)) {
  //       setShowSettings(false);
  //     }
  //   };

  //   if (showSettings) {
  //     document.addEventListener('mousedown', handleClickOutside);
  //   }

  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [showSettings]);


  return (
    <div className="flex flex-col items-center w-full bg-gray-100 min-h-screen font-sans">
      {/* Inject CSS animations */}
      <style>{animations}</style>

      {/* Header với Tabs và Settings */}
      <div className="w-full max-w-6xl px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Flashcard Gallery</h1>

          {/* Setting Button với hiệu ứng hover */}
          <div
            id="settings-button"
            className={`relative flex items-center justify-center p-2 bg-white rounded-lg shadow-sm border transition-all duration-300 cursor-pointer ${isSettingsHovered || showSettings ? 'border-indigo-300 bg-indigo-50 ring-2 ring-indigo-100' : 'border-gray-100'}`}
            onMouseEnter={() => setIsSettingsHovered(true)}
            onMouseLeave={() => setIsSettingsHovered(false)}
            onClick={() => setShowSettings(!showSettings)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${isSettingsHovered || showSettings ? 'text-indigo-600 rotate-45' : 'text-gray-600'} transition-all duration-300`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l-.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l-.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </div>
        </div>

        {/* Redesigned Tab Navigation - With improved background color */}
        <div className="inline-flex rounded-lg bg-white p-1 mb-4 shadow-sm border border-gray-200">
          <button
            onClick={() => setActiveTab('collection')}
            className={`flex items-center space-x-1.5 px-4 py-2 text-sm rounded-lg transition-all duration-300 ${
              activeTab === 'collection'
                ? 'bg-indigo-50 text-indigo-700 font-medium shadow-sm'
                : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ${activeTab === 'collection' ? 'text-indigo-600' : 'text-gray-500'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M7 10h10M7 13h6" />
            </svg>
            <span>Collection</span>
            <span className={`inline-flex items-center justify-center ${activeTab === 'collection' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-200 text-gray-700'} text-xs font-medium px-1.5 py-0.5 rounded-full ml-1`}>{totalFlashcards}</span>
          </button>

          <button
            onClick={() => setActiveTab('favorite')}
            className={`flex items-center space-x-1.5 px-4 py-2 text-sm rounded-lg transition-all duration-300 ${
              activeTab === 'favorite'
                ? 'bg-pink-50 text-pink-700 font-medium shadow-sm'
                : 'text-gray-600 hover:text-pink-600 hover:bg-gray-50'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ${activeTab === 'favorite' ? 'text-pink-600' : 'text-gray-500'}`}
              viewBox="0 0 24 24"
              fill={activeTab === 'favorite' ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>Favorite</span>
            <span className={`inline-flex items-center justify-center ${activeTab === 'favorite' ? 'bg-pink-100 text-pink-800' : 'bg-gray-200 text-gray-700'} text-xs font-medium px-1.5 py-0.5 rounded-full ml-1`}>{favoriteCount}</span>
          </button>
        </div>
      </div>

      {/* Main Content - Với chế độ layout 1 cột hoặc 2 cột */}
      <div className="w-full max-w-6xl px-4 py-4">
        {filteredFlashcards.length > 0 ? (
          <div
            ref={scrollContainerRef}
            className={`w-full ${
              layoutMode === 'double'
                ? 'grid grid-cols-2 gap-6' // Changed back to grid-cols-2
                : 'flex flex-col items-center space-y-16'
            }`}
          >
            {filteredFlashcards.map((card) => (
              <div
                id={`flashcard-${card.id}`}
                key={card.id}
                className={`${layoutMode === 'double' ? 'w-full max-w-full' : 'w-full'} flex flex-col items-center bg-white rounded-xl shadow-xl overflow-hidden relative group ${layoutMode === 'single' ? 'mb-8' : 'mb-0'}`}
              >
                {/* Hiệu ứng hover cho flashcard */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>

                {/* Icon trái tim - Favorite/Unfavorite - Kích thước và padding thay đổi tùy theo layout */}
                <button
                  className={`absolute top-3 right-3 ${layoutMode === 'double' ? 'p-1.5' : 'p-2'} rounded-full bg-white bg-opacity-70 hover:bg-opacity-90 transition-all duration-300 z-10 shadow-md flex items-center justify-center ${card.isFavorite ? 'scale-110' : 'scale-100'}`}
                  onClick={() => toggleFavorite(card.id)}
                  aria-label={card.isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-all duration-300 ${
                      layoutMode === 'double'
                        ? 'h-4 w-4'
                        : 'h-6 w-6'
                    } ${card.isFavorite ? 'text-pink-600 scale-110' : 'text-gray-400'}`}
                    viewBox="0 0 24 24"
                    fill={card.isFavorite ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>

                {/* Container giữ tỷ lệ hình ảnh với hiệu ứng phong cách */}
                <div className="w-full">
                  <div className={`relative w-full ${
                    // Apply frame styles based on visualStyle
                    visualStyle === 'anime' ? 'border-4 border-pink-300 bg-pink-50' :
                    visualStyle === 'comic' ? 'border-4 border-blue-300 border-dashed bg-blue-50' :
                    visualStyle === 'realistic' ? 'p-2 bg-gradient-to-b from-amber-50 to-amber-100' :
                    ''
                  }`}>
                    {/* Apply style-specific overlays */}
                    {visualStyle === 'anime' && (
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-purple-100 opacity-30 mix-blend-overlay pointer-events-none"></div>
                    )}
                    {visualStyle === 'comic' && (
                      <div className="absolute inset-0 bg-blue-100 opacity-20 mix-blend-multiply pointer-events-none"
                        style={{
                          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.2) 1px, transparent 1px)',
                          backgroundSize: '4px 4px'
                        }}>
                      </div>
                    )}
                    {visualStyle === 'realistic' && (
                      <div className="absolute inset-0 shadow-inner pointer-events-none"></div>
                    )}

                    {/* Cập nhật phần hiển thị flashcard để thêm sự kiện click */}
                    <img
                      src={card.imageUrl}
                      alt={`Flashcard ${card.id}`}
                      className={`w-full h-auto ${
                        visualStyle === 'anime' ? 'saturate-150 contrast-105' :
                        visualStyle === 'comic' ? 'contrast-125 brightness-105' :
                        visualStyle === 'realistic' ? 'saturate-105 contrast-110 shadow-md' :
                        ''
                      } cursor-pointer`} // Thêm cursor-pointer
                      style={{
                        aspectRatio: '1024/1536',
                        filter: visualStyle === 'comic' ? 'grayscale(0.1)' : 'none'
                      }}
                      onClick={() => openVocabDetail(card)} // Thêm sự kiện click
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/1024x1536/E0E0E0/333333?text=Image+Error`;
                      }}
                    />

                    {/* Image Detail Overlay based on setting */}
                    {imageDetail !== 'basic' && (
                      <div className={`absolute bottom-0 left-0 right-0 p-3 ${
                        imageDetail === 'phrase'
                          ? 'bg-purple-900 bg-opacity-70'
                          : 'bg-teal-900 bg-opacity-70'
                      }`}>
                         {/* Hiển thị thông tin từ vựng nếu có và imageDetail không phải 'basic' */}
                         {card.vocabulary && imageDetail === 'phrase' && (
                          <p className="text-white font-medium text-center">
                            {card.vocabulary.phrases[0] || 'Không có cụm từ mẫu'} {/* Hiển thị cụm từ đầu tiên hoặc thông báo */}
                          </p>
                        )}
                        {card.vocabulary && imageDetail === 'example' && (
                          <div className="text-white">
                            <p className="font-medium mb-1">Ví dụ:</p>
                            <p className="text-sm opacity-90">{card.vocabulary.example || 'Không có ví dụ'}</p>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Hiển thị trạng thái trống cho tab Favorite nếu không có item nào
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-pink-50 p-6 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-pink-300"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Không có flashcard yêu thích</h3>
            <p className="text-gray-500 max-w-md">Nhấn vào biểu tượng trái tim trên flashcard để thêm vào danh sách yêu thích của bạn</p>
          </div>
        )}
      </div>

      {/* Settings Panel Popup */}
      {showSettings && (
        <>
          {/* Overlay */}
          {/* Loại bỏ sự kiện onClick để ngăn đóng popup khi click vào overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300"
            style={{ animation: 'modalBackdropIn 0.3s ease-out forwards' }}
            // onClick={() => setShowSettings(false)} // Đã loại bỏ dòng này
          ></div>

          {/* Modal Popup */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" // Added max-h and flex-col
              style={{ animation: 'scaleIn 0.3s ease-out forwards' }}
              id="settings-panel"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 flex-shrink-0"> {/* Added flex-shrink-0 */}
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l-.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l-.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    Cài đặt hiển thị
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto max-h-[70vh] flex-grow"> {/* Added overflow-y-auto, max-h and flex-grow */}
                {/* Layout Mode */}
                <div className="mb-4"> {/* Changed mb-6 to mb-4 */}
                  <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center"> {/* Changed mb-3 to mb-2 */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Bố cục hiển thị
                  </h4>
                  <div className="flex space-x-2"> {/* Changed space-x-3 to space-x-2 */}
                    <div
                      className={`flex-1 p-2 border-2 rounded-lg cursor-pointer transition-all flex flex-col items-center ${ // Changed p-3 to p-2, rounded-xl to rounded-lg
                        layoutMode === 'single'
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30'
                      }`}
                      onClick={() => setLayoutMode('single')}
                    >
                      <div className="w-8 h-12 bg-indigo-200 rounded-md shadow-sm mb-1"></div> {/* Changed w-10 h-16 to w-8 h-12, mb-2 to mb-1 */}
                      <span className={`text-xs ${layoutMode === 'single' ? 'text-indigo-700 font-medium' : 'text-gray-600'}`}>1 Cột</span> {/* Changed text-sm to text-xs */}
                    </div>

                    <div
                      className={`flex-1 p-2 border-2 rounded-lg cursor-pointer transition-all flex flex-col items-center ${ // Changed p-3 to p-2, rounded-xl to rounded-lg
                        layoutMode === 'double'
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30'
                      }`}
                      onClick={() => setLayoutMode('double')}
                    >
                      <div className="flex space-x-1 mb-1"> {/* Changed space-x-1 mb-2 to space-x-1 mb-1 */}
                        <div className="w-4 h-12 bg-indigo-200 rounded-md shadow-sm"></div> {/* Changed w-5 h-16 to w-4 h-12 */}
                        <div className="w-4 h-12 bg-indigo-200 rounded-md shadow-sm"></div> {/* Changed w-5 h-16 to w-4 h-12 */}
                      </div>
                      <span className={`text-xs ${layoutMode === 'double' ? 'text-indigo-700 font-medium' : 'text-gray-600'}`}>2 Cột</span> {/* Changed text-sm to text-xs */}
                    </div>
                  </div>
                </div>

                {/* Visual Style */}
                <div className="mb-4"> {/* Changed mb-6 to mb-4 */}
                  <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center"> {/* Changed mb-3 to mb-2 */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                    </svg>
                    Phong cách hiển thị
                  </h4>

                  {/* Style Buttons */}
                  <div className="grid grid-cols-2 gap-2"> {/* Changed grid-cols-2 gap-3 to grid-cols-2 gap-2 */}
                    {/* Default Style */}
                    <div
                      className={`p-2 border-2 rounded-lg cursor-pointer transition-all flex items-center ${ // Changed p-3 to p-2, rounded-xl to rounded-lg
                        visualStyle === 'default'
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30'
                      }`}
                      onClick={() => setVisualStyle('default')}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${ // Changed w-8 h-8 mr-3 to w-6 h-6 mr-2
                        visualStyle === 'default' ? 'bg-indigo-100' : 'bg-gray-100'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${visualStyle === 'default' ? 'text-indigo-600' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor"> {/* Changed h-4 w-4 to h-3 w-3 */}
                          <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z" />
                        </svg>
                      </div>
                      <span className={`text-xs ${visualStyle === 'default' ? 'text-indigo-700 font-medium' : 'text-gray-600'}`}>Mặc định</span> {/* Changed text-sm to text-xs */}
                    </div>

                    {/* Anime Style */}
                    <div
                      className={`p-2 border-2 rounded-lg cursor-pointer transition-all flex items-center ${ // Changed p-3 to p-2, rounded-xl to rounded-lg
                        visualStyle === 'anime'
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-200 hover:bg-pink-50/30'
                      }`}
                      onClick={() => setVisualStyle('anime')}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${ // Changed w-8 h-8 mr-3 to w-6 h-6 mr-2
                        visualStyle === 'anime' ? 'bg-pink-100' : 'bg-gray-100'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${visualStyle === 'anime' ? 'text-pink-600' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor"> {/* Changed h-4 w-4 to h-3 w-3 */}
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className={`text-xs ${visualStyle === 'anime' ? 'text-pink-700 font-medium' : 'text-gray-600'}`}>Anime</span> {/* Changed text-sm to text-xs */}
                    </div>

                    {/* Comic Style */}
                    <div
                      className={`p-2 border-2 rounded-lg cursor-pointer transition-all flex items-center ${ // Changed p-3 to p-2, rounded-xl to rounded-lg
                        visualStyle === 'comic'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/30'
                      }`}
                      onClick={() => setVisualStyle('comic')}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${ // Changed w-8 h-8 mr-3 to w-6 h-6 mr-2
                        visualStyle === 'comic' ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${visualStyle === 'comic' ? 'text-blue-600' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor"> {/* Changed h-4 w-4 to h-3 w-3 */}
                          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                        </svg>
                      </div>
                      <span className={`text-xs ${visualStyle === 'comic' ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>Comic</span> {/* Changed text-sm to text-xs */}
                    </div>

                    {/* Realistic Style */}
                    <div
                      className={`p-2 border-2 rounded-lg cursor-pointer transition-all flex items-center ${ // Changed p-3 to p-2, rounded-xl to rounded-lg
                        visualStyle === 'realistic'
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/30'
                      }`}
                      onClick={() => setVisualStyle('realistic')}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${ // Changed w-8 h-8 mr-3 to w-6 h-6 mr-2
                        visualStyle === 'realistic' ? 'bg-emerald-100' : 'bg-gray-100'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${visualStyle === 'realistic' ? 'text-emerald-600' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor"> {/* Changed h-4 w-4 to h-3 w-3 */}
                          <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className={`text-xs ${visualStyle === 'realistic' ? 'text-emerald-700 font-medium' : 'text-gray-600'}`}>Realistic</span> {/* Changed text-sm to text-xs */}
                    </div>
                  </div>
                </div>

                {/* Image Detail */}
                <div className="mb-4"> {/* Changed mb-6 to mb-4 */}
                  <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center"> {/* Changed mb-3 to mb-2 */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    Chi tiết hình ảnh
                  </h4>

                  {/* Detail Level Buttons */}
                  <div className="grid grid-cols-3 gap-2"> {/* Changed grid-cols-3 gap-3 to grid-cols-3 gap-2 */}
                    {/* Basic Detail */}
                    <div
                      className={`p-2 border-2 rounded-lg cursor-pointer transition-all flex flex-col items-center ${ // Changed p-3 to p-2, rounded-xl to rounded-lg
                        imageDetail === 'basic'
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30'
                      }`}
                      onClick={() => setImageDetail('basic')}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${ // Changed w-8 h-8 mb-2 to w-6 h-6 mb-1
                        imageDetail === 'basic' ? 'bg-indigo-100' : 'bg-gray-100'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${imageDetail === 'basic' ? 'text-indigo-600' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor"> {/* Changed h-4 w-4 to h-3 w-3 */}
                          <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z" />
                        </svg>
                      </div>
                      <span className={`text-xs text-center ${imageDetail === 'basic' ? 'text-indigo-700 font-medium' : 'text-gray-600'}`}>Cơ bản</span> {/* Changed text-sm to text-xs */}
                    </div>

                    {/* Phrase Detail */}
                    <div
                      className={`p-2 border-2 rounded-lg cursor-pointer transition-all flex flex-col items-center ${ // Changed p-3 to p-2, rounded-xl to rounded-lg
                        imageDetail === 'phrase'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/30'
                      }`}
                      onClick={() => setImageDetail('phrase')}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${ // Changed w-8 h-8 mb-2 to w-6 h-6 mb-1
                        imageDetail === 'phrase' ? 'bg-purple-100' : 'bg-gray-100'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${imageDetail === 'phrase' ? 'text-purple-600' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor"> {/* Changed h-4 w-4 to h-3 w-3 */}
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5z" />
                          <path d="M11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                        </svg>
                      </div>
                      <span className={`text-xs text-center ${imageDetail === 'phrase' ? 'text-purple-700 font-medium' : 'text-gray-600'}`}>Cụm Từ</span> {/* Changed text-sm to text-xs */}
                    </div>

                    {/* Example Detail */}
                    <div
                      className={`p-2 border-2 rounded-lg cursor-pointer transition-all flex flex-col items-center ${ // Changed p-3 to p-2, rounded-xl to rounded-lg
                        imageDetail === 'example'
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-teal-200 hover:bg-teal-50/30'
                      }`}
                      onClick={() => setImageDetail('example')}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${ // Changed w-8 h-8 mb-2 to w-6 h-6 mb-1
                        imageDetail === 'example' ? 'bg-teal-100' : 'bg-gray-100'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${imageDetail === 'example' ? 'text-teal-600' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor"> {/* Changed h-4 w-4 to h-3 w-3 */}
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className={`text-xs text-center ${imageDetail === 'example' ? 'text-teal-700 font-medium' : 'text-gray-600'}`}>Ví dụ</span> {/* Changed text-sm to text-xs */}
                    </div>
                  </div>
                </div>


                {/* Buttons */}
              </div> {/* Closed the body div here */}

              {/* Buttons - Fixed Footer */}
              <div className="sticky bottom-0 left-0 right-0 mt-2 bg-white border-t border-gray-100 p-4 flex space-x-3 flex-shrink-0"> {/* Added sticky, bottom-0, left-0, right-0, mt-2, flex-shrink-0 */}
                <button
                  className="flex-1 py-2.5 bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-medium rounded-lg transition-all duration-300" // Changed py-2 to py-2.5
                  onClick={() => setShowSettings(false)}
                >
                  Hủy
                </button>
                <button
                  className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-300 flex items-center justify-center" // Changed py-2 to py-2.5
                  onClick={() => setShowSettings(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Toast thông báo khi thay đổi trạng thái yêu thích */}
      {showFavoriteToast && (
        <div
          className="fixed top-24 right-8 p-4 bg-white rounded-lg shadow-lg border border-pink-200 z-50 flex items-center"
          style={{ animation: 'fadeInOut 2s forwards' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-pink-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-gray-700 font-medium">Đã cập nhật danh sách yêu thích!</span>
        </div>
      )}

      {/* Modal chi tiết từ vựng */}
      {showVocabDetail && selectedVocab && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300"
            style={{ animation: 'modalBackdropIn 0.3s ease-out forwards' }}
            onClick={() => setShowVocabDetail(false)}
          ></div>

          {/* Modal Vocabulary Detail */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              style={{ animation: 'scaleIn 0.3s ease-out forwards' }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-4 flex-shrink-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white">{selectedVocab.word}</h3>
                  <button
                    onClick={() => setShowVocabDetail(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 overflow-y-auto flex-grow">
                {/* Nghĩa */}
                <div className="mb-5">
                  <div className="inline-block bg-blue-50 rounded-full px-3 py-1 text-xs font-semibold text-blue-600 mb-2">
                    Nghĩa
                  </div>
                  <p className="text-gray-800">{selectedVocab.meaning}</p>
                </div>

                {/* Ví dụ */}
                <div className="mb-5">
                  <div className="inline-block bg-green-50 rounded-full px-3 py-1 text-xs font-semibold text-green-600 mb-2">
                    Ví dụ
                  </div>
                  <p className="text-gray-700 italic bg-green-50 p-3 rounded-lg border-l-4 border-green-300">
                    "{selectedVocab.example}"
                  </p>
                </div>

                {/* Cụm từ */}
                <div className="mb-5">
                  <div className="inline-block bg-purple-50 rounded-full px-3 py-1 text-xs font-semibold text-purple-600 mb-2">
                    Cụm từ phổ biến
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedVocab.phrases.map((phrase, index) => (
                      <span key={index} className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-sm">
                        {phrase}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Phổ biến */}
                <div className="mb-5">
                  <div className="inline-block bg-amber-50 rounded-full px-3 py-1 text-xs font-semibold text-amber-600 mb-2">
                    Mức độ phổ biến
                  </div>
                  <div className="flex items-center">
                    <span className={`
                      px-2 py-1 rounded-lg text-sm font-medium
                      ${selectedVocab.popularity === "Cao" ? "bg-green-100 text-green-700" :
                        selectedVocab.popularity === "Trung bình" ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"}
                    `}>
                      {selectedVocab.popularity}
                    </span>

                    {/* Hiển thị biểu đồ mức độ phổ biến */}
                    <div className="ml-3 flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          selectedVocab.popularity === "Cao" ? "bg-green-500 w-4/5" :
                          selectedVocab.popularity === "Trung bình" ? "bg-amber-500 w-1/2" :
                          "bg-red-500 w-1/5"
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Synonyms & Antonyms */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Từ đồng nghĩa */}
                  <div>
                    <div className="inline-block bg-indigo-50 rounded-full px-3 py-1 text-xs font-semibold text-indigo-600 mb-2">
                      Từ đồng nghĩa
                    </div>
                    <div className="flex flex-col gap-1">
                      {selectedVocab.synonyms.map((word, index) => (
                        <span key={index} className="text-gray-700 text-sm bg-indigo-50 px-2 py-1 rounded">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Từ trái nghĩa */}
                  <div>
                    <div className="inline-block bg-pink-50 rounded-full px-3 py-1 text-xs font-semibold text-pink-600 mb-2">
                      Từ trái nghĩa
                    </div>
                    <div className="flex flex-col gap-1">
                      {selectedVocab.antonyms.map((word, index) => (
                        <span key={index} className="text-gray-700 text-sm bg-pink-50 px-2 py-1 rounded">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 p-4 bg-gray-50">
                <button
                  className="w-full py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center"
                  onClick={() => setShowVocabDetail(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
