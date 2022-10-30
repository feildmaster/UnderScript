const argExtractor = {
  appendCardCardSkinShop: (...args) => args,
  appendCardFriendship: (_, ...args) => args,
  showCardHover: (...args) => args,
};

export default function getExtras(key, args = []) {
  const extractor = argExtractor[key];
  if (!extractor) return null;
  return extractor(...args);
}
