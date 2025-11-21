export const mockProducts = [
  {
    id: 1,
    slug: "chat-consultation",
    slug_old: "chat-consultation",
    title: "Chat",
    title_en: "Chat Consultation",
    summary: "Online consultation via text chat",
    description: "In this type of consultation, you can communicate with your doctor through text chat and ask your questions.",
    display_rank: 1,
    created_at: "2025-11-20T00:00:00Z",
    prices: [
      {
        id: 1,
        product_id: 1,
        title: "30-minute Consultation",
        price: 500,
        discount_amount: 0,
        discount_percent: "0",
        currency: "USD",
        created_at: "2025-11-20T00:00:00Z"
      },
      {
        id: 2,
        product_id: 1,
        title: "60-minute Consultation",
        price: 800,
        discount_amount: 0,
        discount_percent: "0",
        currency: "USD",
        created_at: "2025-11-20T00:00:00Z"
      }
    ]
  },
  {
    id: 2,
    slug: "video-consultation",
    slug_old: "video-consultation",
    title: "Video Consultation",
    title_en: "Video Consultation",
    summary: "Online consultation via video call",
    description: "In this type of consultation, you can talk to your doctor through a video call and receive advice.",
    display_rank: 2,
    created_at: "2025-11-20T00:00:00Z",
    prices: [
      {
        id: 3,
        product_id: 2,
        title: "30-minute Consultation",
        price: 75,
        discount_amount: 0,
        discount_percent: "0",
        currency: "USD",
        created_at: "2025-11-20T00:00:00Z"
      },
      {
        id: 4,
        product_id: 2,
        title: "60-minute Consultation",
        price: 1200,
        discount_amount: 10000,
        discount_percent: "8",
        currency: "USD",
        created_at: "2025-11-20T00:00:00Z"
      }
    ]
  },
  {
    id: 3,
    slug: "scheduled-phone-consultation",
    slug_old: "scheduled-phone-consultation",
    title: "Scheduled Phone Consultation",
    title_en: "Scheduled Phone Consultation",
    summary: "Scheduled phone consultation",
    description: "Scheduled phone consultation with a specialist doctor.",
    display_rank: 3,
    created_at: "2025-11-20T00:00:00Z",
    prices: [
      {
        id: 5,
        product_id: 3,
        title: "30-minute Consultation",
        price: 600,
        discount_amount: 0,
        discount_percent: "0",
        currency: "USD",
        created_at: "2025-11-20T00:00:00Z"
      }
    ]
  }
];