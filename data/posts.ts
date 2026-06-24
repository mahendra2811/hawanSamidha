import type { Localized } from "./products.schema";

/**
 * Lightweight, data-driven blog (bilingual). Phase-0 keeps content here instead
 * of MDX so posts are SSG and type-safe; swapping to @next/mdx later is a drop-in
 * at the page level (the loader API below stays the same).
 */
export type PostBlock = { type: "h2" | "p"; text: Localized };

export type Post = {
  slug: string;
  date: string; // ISO
  title: Localized;
  excerpt: Localized;
  cover?: string;
  body: PostBlock[];
};

export const posts: Post[] = [
  {
    slug: "choosing-the-right-hawan-samagri",
    date: "2026-01-15",
    title: {
      en: "How to choose the right hawan samagri for your puja",
      hi: "अपनी पूजा के लिए सही हवन सामग्री कैसे चुनें",
    },
    excerpt: {
      en: "A quick guide to ingredients, purity and packaging when buying hawan samagri in bulk.",
      hi: "थोक में हवन सामग्री खरीदते समय सामग्री, शुद्धता और पैकेजिंग की त्वरित मार्गदर्शिका।",
    },
    body: [
      {
        type: "p",
        text: {
          en: "Hawan samagri is a blend of aromatic herbs, resins and grains offered in the sacred fire. For daily puja and large yagnas alike, the quality of the blend matters — both for fragrance and for a clean, complete burn.",
          hi: "हवन सामग्री सुगंधित जड़ी-बूटियों, गोंद और अनाज का मिश्रण है जो पवित्र अग्नि में अर्पित किया जाता है। दैनिक पूजा और बड़े यज्ञ दोनों के लिए मिश्रण की गुणवत्ता महत्वपूर्ण है — सुगंध और स्वच्छ, पूर्ण दहन दोनों के लिए।",
        },
      },
      {
        type: "h2",
        text: { en: "Look at the ingredients", hi: "सामग्री देखें" },
      },
      {
        type: "p",
        text: {
          en: "Quality samagri lists its key ingredients — guggal, jau, til, herbs and natural fragrances. Avoid blends padded with sawdust or synthetic perfume.",
          hi: "अच्छी सामग्री अपने मुख्य अवयव बताती है — गुग्गल, जौ, तिल, जड़ी-बूटियाँ और प्राकृतिक सुगंध। बुरादे या कृत्रिम इत्र से भरे मिश्रण से बचें।",
        },
      },
      {
        type: "h2",
        text: { en: "Buy in the right tier", hi: "सही टियर में खरीदें" },
      },
      {
        type: "p",
        text: {
          en: "For resale or temple supply, bulk tiers (per kg, per quintal) are far more economical than retail packs. Share your monthly requirement and we'll suggest the best packaging.",
          hi: "पुनर्विक्रय या मंदिर आपूर्ति के लिए, थोक टियर (प्रति किग्रा, प्रति क्विंटल) खुदरा पैक से कहीं अधिक किफायती हैं। अपनी मासिक आवश्यकता बताएँ, हम सर्वोत्तम पैकेजिंग सुझाएँगे।",
        },
      },
    ],
  },
  {
    slug: "why-mango-wood-samidha",
    date: "2026-02-10",
    title: {
      en: "Why mango-wood samidha is preferred for havan",
      hi: "हवन के लिए आम की लकड़ी की समिधा क्यों पसंद की जाती है",
    },
    excerpt: {
      en: "Mango wood (aam ki lakdi) burns clean and fragrant — here's why it's the traditional choice.",
      hi: "आम की लकड़ी स्वच्छ और सुगंधित जलती है — जानिए यह पारंपरिक पसंद क्यों है।",
    },
    body: [
      {
        type: "p",
        text: {
          en: "Samidha are the wooden sticks offered alongside samagri in a havan. Mango wood is the classic choice across India for good reason.",
          hi: "समिधा हवन में सामग्री के साथ अर्पित की जाने वाली लकड़ी की छड़ें हैं। आम की लकड़ी पूरे भारत में उचित कारणों से उत्कृष्ट पसंद है।",
        },
      },
      {
        type: "h2",
        text: { en: "Clean, fragrant burn", hi: "स्वच्छ, सुगंधित दहन" },
      },
      {
        type: "p",
        text: {
          en: "Well-seasoned mango wood lights easily, burns steadily and releases a mild, pleasant aroma without excessive smoke — ideal for indoor and temple havans.",
          hi: "अच्छी तरह सूखी आम की लकड़ी आसानी से जलती है, स्थिर रूप से जलती है और बिना अधिक धुएँ के हल्की, सुखद सुगंध देती है — इनडोर व मंदिर हवन के लिए आदर्श।",
        },
      },
      {
        type: "h2",
        text: { en: "Sourcing and packaging", hi: "सोर्सिंग और पैकेजिंग" },
      },
      {
        type: "p",
        text: {
          en: "We supply seasoned mango-wood samidha in tied bundles and bulk bags, sized for both daily temple use and large-scale events.",
          hi: "हम बँधे बंडलों और थोक बैगों में सूखी आम की लकड़ी की समिधा की आपूर्ति करते हैं, जो दैनिक मंदिर उपयोग और बड़े आयोजनों दोनों के लिए उपयुक्त है।",
        },
      },
    ],
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllPostSlugs(): string[] {
  return posts.map((p) => p.slug);
}
