export const mockProducts = [
  {
    id: 1,
    slug: "chat-consultation",
    slug_old: "chat-consultation",
    title: "مشاوره متنی",
    title_en: "Chat Consultation",
    summary: "مشاوره آنلاین از طریق چت متنی",
    description: "در این نوع مشاوره، می‌توانید از طریق چت متنی با پزشک خود ارتباط برقرار کنید و سوالات خود را بپرسید.",
    display_rank: 1,
    created_at: "2025-11-20T00:00:00Z",
    prices: [
      {
        id: 1,
        product_id: 1,
        title: "مشاوره ۳۰ دقیقه‌ای",
        price: 50000,
        discount_amount: 0,
        discount_percent: "0",
        currency: "تومان",
        created_at: "2025-11-20T00:00:00Z"
      },
      {
        id: 2,
        product_id: 1,
        title: "مشاوره ۶۰ دقیقه‌ای",
        price: 80000,
        discount_amount: 5000,
        discount_percent: "6",
        currency: "تومان",
        created_at: "2025-11-20T00:00:00Z"
      }
    ]
  },
  {
    id: 2,
    slug: "video-consultation",
    slug_old: "video-consultation",
    title: "مشاوره تصویری",
    title_en: "Video Consultation",
    summary: "مشاوره آنلاین از طریق تماس تصویری",
    description: "در این نوع مشاوره، می‌توانید از طریق تماس تصویری با پزشک خود صحبت کنید و مشاوره دریافت کنید.",
    display_rank: 2,
    created_at: "2025-11-20T00:00:00Z",
    prices: [
      {
        id: 3,
        product_id: 2,
        title: "مشاوره ۳۰ دقیقه‌ای",
        price: 75000,
        discount_amount: 0,
        discount_percent: "0",
        currency: "تومان",
        created_at: "2025-11-20T00:00:00Z"
      },
      {
        id: 4,
        product_id: 2,
        title: "مشاوره ۶۰ دقیقه‌ای",
        price: 120000,
        discount_amount: 10000,
        discount_percent: "8",
        currency: "تومان",
        created_at: "2025-11-20T00:00:00Z"
      }
    ]
  },
  {
    id: 3,
    slug: "scheduled-phone-consultation",
    slug_old: "scheduled-phone-consultation",
    title: "مشاوره تلفنی برنامه‌ریزی شده",
    title_en: "Scheduled Phone Consultation",
    summary: "مشاوره تلفنی در زمان تعیین شده",
    description: "مشاوره تلفنی در زمان مشخص شده با پزشک متخصص.",
    display_rank: 3,
    created_at: "2025-11-20T00:00:00Z",
    prices: [
      {
        id: 5,
        product_id: 3,
        title: "مشاوره ۳۰ دقیقه‌ای",
        price: 60000,
        discount_amount: 0,
        discount_percent: "0",
        currency: "تومان",
        created_at: "2025-11-20T00:00:00Z"
      }
    ]
  }
];