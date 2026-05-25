import { Subject, Question } from '../types';

export const mockSubjects: Subject[] = [
  {
    id: 'family',
    name: 'Gia đình & Bạn bè (Family)',
    icon: 'Users',
    questionsCount: 4,
    description: 'Tìm hiểu về các thành viên trong gia đình và bạn bè thân yêu nhé!'
  },
  {
    id: 'school',
    name: 'Lớp học & Đồ dùng (School)',
    icon: 'GraduationCap',
    questionsCount: 4,
    description: 'Học các từ vựng về lớp học tinh nghịch và đồ dùng học tập hàng ngày.'
  },
  {
    id: 'hobbies',
    name: 'Sở thích & Thể thao (Hobbies)',
    icon: 'Sparkles',
    questionsCount: 4,
    description: 'Khám phá các môn thể thao năng động và những sở thích thú vị trong thời gian rảnh!'
  },
  {
    id: 'nature',
    name: 'Thiên nhiên & Động vật (Nature)',
    icon: 'Trees',
    questionsCount: 4,
    description: 'Làm quen với các bạn thú nhỏ đáng yêu cùng thế giới tự nhiên xung quanh ta.'
  }
];

export const mockQuestions: Question[] = [
  // --- Family Subject ---
  {
    id: 'fam_1',
    subjectId: 'family',
    content: "This is your father's wife. She cooks delicious meals and loves you very much. Who is she?",
    type: 'guess-word',
    correctAnswer: 'mother',
    explanation: "'mother' có nghĩa là 'mẹ'. Mẹ là vợ của bố, luôn yêu thương chăm sóc chúng ta từng bữa ăn giấc ngủ đó con!",
    difficulty: 'easy',
    clue: '👩 Người mẹ hiền hậu',
    options: ['mother', 'sister', 'grandmother', 'aunt']
  },
  {
    id: 'fam_2',
    subjectId: 'family',
    content: "My mother has a sister. She is my ___.",
    type: 'gap-filling',
    options: ['uncle', 'aunt', 'cousin', 'brother'],
    correctAnswer: 'aunt',
    explanation: "'aunt' có nghĩa là 'cô, dì hoặc bác gái'. Chị hoặc em gái của mẹ sẽ được gọi là aunt.",
    difficulty: 'medium',
    clue: '👩‍💼 Chị/em gái của mẹ'
  },
  {
    id: 'fam_3',
    subjectId: 'family',
    content: "Hãy nối các từ tiếng Anh chỉ gia đình sau với nghĩa tiếng Việt đúng của chúng:",
    type: 'matching',
    correctAnswer: 'sister:chị/em gái, brother:anh/em trai, grandfather:ông ngoại/nội, grandmother:bà ngoại/nội',
    matchedPairs: [
      { left: 'sister', right: 'chị/em gái' },
      { left: 'brother', right: 'anh/em trai' },
      { left: 'grandfather', right: 'ông ngoại/nội' },
      { left: 'grandmother', right: 'bà ngoại/nội' }
    ],
    explanation: "Sister (chị/em gái), Brother (anh/em trai), Grandfather (ông), Grandmother (bà).",
    difficulty: 'easy',
    clue: '👨‍👩‍👧‍👦 Các thành viên thân thương trong nhà',
    options: ['sister', 'brother', 'grandfather', 'grandmother']
  },
  {
    id: 'fam_4',
    subjectId: 'family',
    content: "This is my ___. He is my father's son and younger than me.",
    type: 'gap-filling',
    options: ['brother', 'sister', 'mother', 'uncle'],
    correctAnswer: 'brother',
    explanation: "'brother' có nghĩa là 'em trai' (hoặc anh trai). Ở đây là con trai của bố và nhỏ tuổi hơn chúng ta.",
    difficulty: 'medium',
    clue: '👦 Em trai tinh nghịch'
  },

  // --- School Subject ---
  {
    id: 'sch_1',
    subjectId: 'school',
    content: "We use this object to draw a straight line or measure a book in class. What is it?",
    type: 'guess-word',
    correctAnswer: 'ruler',
    explanation: "'ruler' có nghĩa là 'thước kẻ'. Đây là người bạn nhỏ giúp chúng ta kẻ những đường băng thẳng tắp trên trang vở.",
    difficulty: 'easy',
    clue: '📏 Đồ dùng văn phòng phẩm không thể thiếu',
    options: ['pencil', 'ruler', 'eraser', 'notebook']
  },
  {
    id: 'sch_2',
    subjectId: 'school',
    content: "The teacher writes on the black___ using a white piece of chalk.",
    type: 'gap-filling',
    options: ['board', 'desk', 'chair', 'room'],
    correctAnswer: 'board',
    explanation: "'blackboard' hay 'board' là chiếc 'bảng đen' thân quen, nơi cô giáo viết những bài học hay bằng phấn trắng.",
    difficulty: 'easy',
    clue: '💬 Nơi ghi nhận bài học trong lớp học'
  },
  {
    id: 'sch_3',
    subjectId: 'school',
    content: "Nối thật nhanh các dụng cụ học tập trong ba lô của con nào:",
    type: 'matching',
    correctAnswer: 'pencil:bút chì, notebook:vở viết, eraser:cục tẩy, backpack:ba lô',
    matchedPairs: [
      { left: 'pencil', right: 'bút chì' },
      { left: 'notebook', right: 'vở viết' },
      { left: 'eraser', right: 'cục tẩy' },
      { left: 'backpack', right: 'ba lô' }
    ],
    explanation: "Pencil (bút chì), Notebook (vở), Eraser (cục tẩy), Backpack (ba lô).",
    difficulty: 'easy',
    clue: '🎒 Những bảo bối cùng con đi học mỗi ngày',
    options: ['pencil', 'notebook', 'eraser', 'backpack']
  },
  {
    id: 'sch_4',
    subjectId: 'school',
    content: "This friendly person helps children learn letters, numbers, and fun songs in the classroom.",
    type: 'guess-word',
    correctAnswer: 'teacher',
    explanation: "'teacher' là 'thầy giáo, cô giáo'. Người luôn luôn ân cần dạy bảo chúng ta học bao điều bổ ích.",
    difficulty: 'easy',
    clue: '👩‍🏫 Người lái đò tri thức',
    options: ['teacher', 'doctor', 'pilot', 'singer']
  },

  // --- Hobbies Subject ---
  {
    id: 'hob_1',
    subjectId: 'hobbies',
    content: "We kick a round black and white ball into a net on a big green field. What sport is this?",
    type: 'guess-word',
    correctAnswer: 'football',
    explanation: "'football' có nghĩa là 'bóng đá'. Đây chính là môn thể thao vua được hàng triệu bạn bè trên thế giới yêu mến!",
    difficulty: 'easy',
    clue: '⚽ Trận đấu sôi động trên sân cỏ',
    options: ['football', 'tennis', 'badminton', 'swimming']
  },
  {
    id: 'hob_2',
    subjectId: 'hobbies',
    content: "I love reading comics and stories. Reading is my favorite ___.",
    type: 'gap-filling',
    options: ['hobby', 'sport', 'game', 'class'],
    correctAnswer: 'hobby',
    explanation: "'hobby' nghĩa là 'sở thích'. Thói quen lành mạnh như đọc sách, vẽ tranh gọi là hobby.",
    difficulty: 'medium',
    clue: '🎨 Niềm đam mê trong thời gian rảnh'
  },
  {
    id: 'hob_3',
    subjectId: 'hobbies',
    content: "Nối nhanh các từ chỉ hoạt động thú vị ngày cuối tuần:",
    type: 'matching',
    correctAnswer: 'singing:hát, drawing:vẽ tranh, swimming:bơi lội, dancing:nhảy múa',
    matchedPairs: [
      { left: 'singing', right: 'hát' },
      { left: 'drawing', right: 'vẽ tranh' },
      { left: 'swimming', right: 'bơi lội' },
      { left: 'dancing', right: 'nhảy múa' }
    ],
    explanation: "Singing (hát ca), Drawing (vẽ vẽ tranh), Swimming (bơi lội dưới mát lạnh), Dancing (nhảy múa nhịp nhàng).",
    difficulty: 'medium',
    clue: '✨ Những hoạt động vui hết nấc',
    options: ['singing', 'drawing', 'swimming', 'dancing']
  },
  {
    id: 'hob_4',
    subjectId: 'hobbies',
    content: "She loves building models and flying her beautiful red ___ in the windy park.",
    type: 'gap-filling',
    options: ['kite', 'car', 'ball', 'bike'],
    correctAnswer: 'kite',
    explanation: "'kite' là 'chiếc diều'. Bay cao tít trên bầu trời lộng gió nhờ sợi dây thừng điều khiển.",
    difficulty: 'easy',
    clue: '🪁 Cánh diều rực rỡ ngày gió lớn'
  },

  // --- Nature Subject ---
  {
    id: 'nat_1',
    subjectId: 'nature',
    content: "This cute animal is small, has long fluffy ears, hops around, and loves sweet orange carrots.",
    type: 'guess-word',
    correctAnswer: 'rabbit',
    explanation: "'rabbit' là 'con thỏ'. Chú thỏ trắng tai dài nhảy lò cò, gặm cà rốt giòn rụm trông siêu cưng đúng không!",
    difficulty: 'easy',
    clue: '🐰 Bạn thỏ đáng yêu tìm củ cải',
    options: ['rabbit', 'monkey', 'tiger', 'lion']
  },
  {
    id: 'nat_2',
    subjectId: 'nature',
    content: "Look! In the sky, the bright red ___ is shining and keeping our planet warm during the day.",
    type: 'gap-filling',
    options: ['sun', 'moon', 'star', 'cloud'],
    correctAnswer: 'sun',
    explanation: "'sun' là 'ông mặt trời'. Mặt trời tỏa ánh nắng ấm áp giúp muôn hoa tươi tốt.",
    difficulty: 'easy',
    clue: '☀️ Luồng nắng ấm rực rỡ'
  },
  {
    id: 'nat_3',
    subjectId: 'nature',
    content: "Nối tên tiếng Anh chuẩn xác cho các kỳ quan thiên nhiên sau nào các con:",
    type: 'matching',
    correctAnswer: 'flower:bông hoa, forest:khu rừng, monkey:con khỉ, river:con sông',
    matchedPairs: [
      { left: 'flower', right: 'bông hoa' },
      { left: 'forest', right: 'khu rừng' },
      { left: 'monkey', right: 'con khỉ' },
      { left: 'river', right: 'con sông' }
    ],
    explanation: "Flower (bông hoa thơm), Forest (khu rừng rộng), Monkey (chú khỉ leo trèo), River (dòng sông êm đềm).",
    difficulty: 'easy',
    clue: '🌳 Thế giới quanh ta kỳ diệu biết bao',
    options: ['flower', 'forest', 'monkey', 'river']
  },
  {
    id: 'nat_4',
    subjectId: 'nature',
    content: "This giant cat has beautiful orange coat and black stripes. It is the brave king of the jungle.",
    type: 'guess-word',
    correctAnswer: 'tiger',
    explanation: "'tiger' nghĩa là 'con hổ' hay chúa sơn lâm dũng mãnh, đầy móng vuốt uy phong.",
    difficulty: 'medium',
    clue: '🐯 Chúa sơn lâm oai phong lẫm liệt',
    options: ['tiger', 'cat', 'rabbit', 'monkey']
  }
];
