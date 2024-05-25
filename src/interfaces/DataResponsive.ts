export interface DataRespond {
    from: string
    to: string
    generationmix: Generationmix[]
}

export interface Generationmix {
    fuel: string
    perc: number
}
