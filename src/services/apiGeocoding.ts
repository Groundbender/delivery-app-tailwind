export interface ICoords {
  latitude: number;
  longitude: number;
}

export const getAddress = async ({ latitude, longitude }: ICoords) => {
  const res = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`
  );
  if (!res.ok) throw Error("Failed getting address");

  const data = await res.json();
  console.log(data);
  return data;
};
