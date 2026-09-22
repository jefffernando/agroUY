export type Sponsor = { name: string; description: string; url: string; label?: string };
export const sponsors: {
 generalSponsor?: Sponsor;
 categorySponsors: Record<string, Sponsor>;
 bannerSponsors: Sponsor[];
 featuredCompanies: Sponsor[];
 newsletterSponsor?: Sponsor;
 articleSponsors: Record<string, Sponsor>;
} = {
 categorySponsors: {}, bannerSponsors: [], featuredCompanies: [], articleSponsors: {},
};
