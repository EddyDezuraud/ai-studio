interface Logo {
    src: string; 
    type: string
}

interface Metadata {
    name: string;
    description: string;
    image: string;
    logo: Logo;
}

export type { Metadata, Logo };