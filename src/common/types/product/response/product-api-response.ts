export type FakestoreAPIProductResponse = {
    id: number,
    title: string,
    price: number,
    description: string,
    category: string, 
    image: string,
    rating: Rating 
}

type Rating = {
    rate: string,
    count: number
}
