interface socialMedia {
    name: string;
    url: string;
    icon: string;
    isBlack?: boolean;
}

const baseUrl  = `${process.env.NEXT_PUBLIC_AWS_S3_BASE_URL}svgs/`;

export const socialMedia: socialMedia[] = [
    {
        name: "GitHub",
        url: `${process.env.GitHub_URL}`,
        icon: `${baseUrl}github.svg`,
        isBlack: true,
    },
    {
        name: "LinkedIn",
        url: `${process.env.LinkedIn_URL}`,
        icon: `${baseUrl}linkedin.svg`,
        isBlack: true,
    },
    {
        name: "Personal Website",
        url: `${process.env.Personal_Website_URL}`,
        icon: `${baseUrl}earth.svg`,
        isBlack: true,
    },
    {
        name: "Discord",
        url: `${process.env.Discord_Profile}`,
        icon: `${baseUrl}discord.svg`,
        isBlack: true,
    },
    {
        name: "Youtube",
        url: `${process.env.Youtube_URL}`,
        icon: `${baseUrl}youtube.svg`,
        isBlack: true,
    }
];