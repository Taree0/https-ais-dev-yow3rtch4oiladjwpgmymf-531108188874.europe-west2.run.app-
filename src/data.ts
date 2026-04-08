/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Player {
  id: string; // Changed to string to support "Team_Index" format
  name: string;
  position: string;
  number: number;
  club: string;
  rarity: 'common' | 'rare' | 'legendary';
  image: string;
  shiny?: boolean;
  age?: number;
  stats?: {
    goals: number;
    assists: number;
    appearances: number;
  };
}

export const GROUPS: Record<string, string[]> = {
  'A': ['SAD', 'Meksiko', 'Kanada', 'BiH'],
  'B': ['Brazil', 'Francuska', 'Maroko', 'Japan'],
  'C': ['Argentina', 'Španija', 'Egipt', 'Australija'],
  'D': ['Engleska', 'Njemačka', 'Ekvador', 'Južna Koreja'],
  'E': ['Portugal', 'Holandija', 'Nigerija', 'Saudijska Arabija'],
  'F': ['Italija', 'Urugvaj', 'Senegal', 'Kina'],
  'G': ['Hrvatska', 'Švicarska', 'Gana', 'Iran'],
  'H': ['Belgija', 'Kolumbija', 'Kamerun', 'Irak'],
  'I': ['Slovenija', 'Srbija', 'Peru', 'Katar'],
  'J': ['Danska', 'Austrija', 'Obala Slonovače', 'Panama'],
  'K': ['Švedska', 'Norveška', 'Mali', 'Jamajka'],
  'L': ['Turska', 'Ukrajina', 'Alžir', 'Kosta Rika']
};

export const NATIONS = Object.values(GROUPS).flat();

export const NATION_BACKGROUNDS: Record<string, string> = {
  'SAD': 'https://images.unsplash.com/photo-1508433957232-3107f5fd5995?auto=format&fit=crop&q=80&w=2000',
  'Meksiko': 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&q=80&w=2000',
  'Kanada': 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&q=80&w=2000',
  'BiH': 'https://images.unsplash.com/photo-1562326303-31bb8d0f4873?auto=format&fit=crop&q=80&w=2000',
  'Brazil': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80&w=2000',
  'Francuska': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=2000',
  'Maroko': 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80&w=2000',
  'Japan': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=2000',
  'Argentina': 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&q=80&w=2000',
  'Španija': 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&q=80&w=2000',
  'Egipt': 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&q=80&w=2000',
  'Australija': 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&q=80&w=2000',
  'Engleska': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=2000',
  'Njemačka': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=2000',
  'Ekvador': 'https://images.unsplash.com/photo-1589407633195-673e86795861?auto=format&fit=crop&q=80&w=2000',
  'Južna Koreja': 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&q=80&w=2000',
  'Portugal': 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&q=80&w=2000',
  'Holandija': 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&q=80&w=2000',
  'Nigerija': 'https://images.unsplash.com/photo-1534271057238-c2c170a76672?auto=format&fit=crop&q=80&w=2000',
  'Saudijska Arabija': 'https://images.unsplash.com/photo-1586724230021-4c3838ebea72?auto=format&fit=crop&q=80&w=2000',
  'Italija': 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=2000',
  'Urugvaj': 'https://images.unsplash.com/photo-1578305141042-43666f0761e3?auto=format&fit=crop&q=80&w=2000',
  'Senegal': 'https://images.unsplash.com/photo-1523841589119-b444fe055952?auto=format&fit=crop&q=80&w=2000',
  'Kina': 'https://images.unsplash.com/photo-1508197149814-0cc02e8b7f74?auto=format&fit=crop&q=80&w=2000',
  'Hrvatska': 'https://images.unsplash.com/photo-1555990540-02a206186bb7?auto=format&fit=crop&q=80&w=2000',
  'Švicarska': 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=2000',
  'Gana': 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80&w=2000',
  'Iran': 'https://images.unsplash.com/photo-1527126887308-6cee83cca8c1?auto=format&fit=crop&q=80&w=2000',
  'Belgija': 'https://images.unsplash.com/photo-1534024674330-442367448ca7?auto=format&fit=crop&q=80&w=2000',
  'Kolumbija': 'https://images.unsplash.com/photo-1583997051654-8202938b5823?auto=format&fit=crop&q=80&w=2000',
  'Kamerun': 'https://images.unsplash.com/photo-1523805081446-ed9a7bb8997a?auto=format&fit=crop&q=80&w=2000',
  'Irak': 'https://images.unsplash.com/photo-1516108317508-6788f6a160e6?auto=format&fit=crop&q=80&w=2000',
  'Slovenija': 'https://images.unsplash.com/photo-1517736996303-4eec4a66bb17?auto=format&fit=crop&q=80&w=2000',
  'Srbija': 'https://images.unsplash.com/photo-1552133457-ce1d2d33cdfb?auto=format&fit=crop&q=80&w=2000',
  'Peru': 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&q=80&w=2000',
  'Katar': 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&q=80&w=2000',
  'Danska': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&q=80&w=2000',
  'Austrija': 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=2000',
  'Obala Slonovače': 'https://images.unsplash.com/photo-1523805081446-ed9a7bb8997a?auto=format&fit=crop&q=80&w=2000',
  'Panama': 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&q=80&w=2000',
  'Švedska': 'https://images.unsplash.com/photo-1509339022327-1e1e25360a41?auto=format&fit=crop&q=80&w=2000',
  'Norveška': 'https://images.unsplash.com/photo-1506701908216-88151bc51963?auto=format&fit=crop&q=80&w=2000',
  'Mali': 'https://images.unsplash.com/photo-1523805081446-ed9a7bb8997a?auto=format&fit=crop&q=80&w=2000',
  'Jamajka': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=2000',
  'Turska': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=2000',
  'Ukrajina': 'https://images.unsplash.com/photo-1561542320-9a18cd340469?auto=format&fit=crop&q=80&w=2000',
  'Alžir': 'https://images.unsplash.com/photo-1523805081446-ed9a7bb8997a?auto=format&fit=crop&q=80&w=2000',
  'Kosta Rika': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=2000'
};

export const USMNT_PLAYERS: Player[] = [
  { id: "SAD_1", name: "Matt Freese", position: 'GK', number: 1, club: "New York City FC", rarity: 'rare', image: "https://picsum.photos/seed/freese/400/600", age: 27, stats: { goals: 0, assists: 0, appearances: 3 } },
  { id: "SAD_2", name: "Matt Turner", position: 'GK', number: 12, club: "New England Revolution", rarity: 'rare', image: "https://picsum.photos/seed/turner/400/600", age: 31, stats: { goals: 0, assists: 0, appearances: 53 } },
  { id: "SAD_3", name: "Tim Ream", position: 'DF', number: 13, club: "Charlotte FC", rarity: 'legendary', image: "https://picsum.photos/seed/ream/400/600", age: 38, stats: { goals: 1, assists: 0, appearances: 64 } },
  { id: "SAD_4", name: "Chris Richards", position: 'DF', number: 4, club: "Crystal Palace", rarity: 'rare', image: "https://picsum.photos/seed/richards/400/600", age: 26, stats: { goals: 1, assists: 1, appearances: 21 } },
  { id: "SAD_5", name: "Antonee Robinson", position: 'DF', number: 5, club: "Fulham", rarity: 'rare', image: "https://picsum.photos/seed/antonee/400/600", age: 28, stats: { goals: 4, assists: 7, appearances: 46 } },
  { id: "SAD_6", name: "Weston McKennie", position: 'MF', number: 8, club: "Juventus", rarity: 'legendary', image: "https://picsum.photos/seed/mckennie/400/600", age: 27, stats: { goals: 11, assists: 5, appearances: 53 } },
  { id: "SAD_7", name: "Gio Reyna", position: 'MF', number: 7, club: "Borussia Mönchengladbach", rarity: 'rare', image: "https://picsum.photos/seed/reyna/400/600", age: 23, stats: { goals: 8, assists: 4, appearances: 31 } },
  { id: "SAD_8", name: "Malik Tillman", position: 'MF', number: 10, club: "Bayer Leverkusen", rarity: 'rare', image: "https://picsum.photos/seed/tillman/400/600", age: 23, stats: { goals: 2, assists: 3, appearances: 14 } },
  { id: "SAD_9", name: "Christian Pulisic", position: 'FW', number: 11, club: "AC Milan", rarity: 'legendary', image: "https://picsum.photos/seed/pulisic/400/600", age: 27, stats: { goals: 31, assists: 16, appearances: 72 } },
  { id: "SAD_10", name: "Folarin Balogun", position: 'FW', number: 20, club: "AS Monaco", rarity: 'rare', image: "https://picsum.photos/seed/balogun/400/600", age: 24, stats: { goals: 5, assists: 2, appearances: 17 } },
  { id: "SAD_11", name: "Ricardo Pepi", position: 'FW', number: 9, club: "PSV Eindhoven", rarity: 'rare', image: "https://picsum.photos/seed/pepi/400/600", age: 23, stats: { goals: 10, assists: 3, appearances: 28 } },
  { id: "SAD_12", name: "Timothy Weah", position: 'FW', number: 22, club: "Marseille", rarity: 'rare', image: "https://picsum.photos/seed/weah/400/600", age: 26, stats: { goals: 6, assists: 5, appearances: 41 } },
  { id: "SAD_13", name: "Tanner Tessmann", position: 'MF', number: 15, club: "Lyon", rarity: 'rare', image: "https://picsum.photos/seed/tessmann/400/600", age: 24, stats: { goals: 0, assists: 1, appearances: 5 } },
  { id: "SAD_14", name: "Alex Freeman", position: 'DF', number: 2, club: "Villarreal", rarity: 'rare', image: "https://picsum.photos/seed/freeman/400/600", age: 21, stats: { goals: 0, assists: 0, appearances: 2 } },
  { id: "SAD_15", name: "Johnny Cardoso", position: 'MF', number: 6, club: "Atlético Madrid", rarity: 'rare', image: "https://picsum.photos/seed/cardoso/400/600", age: 24, stats: { goals: 0, assists: 0, appearances: 11 } },
  { id: "SAD_16", name: "Patrick Agyemang", position: 'FW', number: 19, club: "Derby County", rarity: 'common', image: "https://picsum.photos/seed/agyemang/400/600", age: 25, stats: { goals: 1, assists: 0, appearances: 4 } },
];

export const BIH_PLAYERS: Player[] = [
  { id: "BiH_1", name: "Nikola Vasilj", position: 'GK', number: 1, club: "St. Pauli", rarity: 'common', image: "https://picsum.photos/seed/vasilj/400/600", age: 30, stats: { goals: 0, assists: 0, appearances: 12 } },
  { id: "BiH_2", name: "Anel Ahmedhodžić", position: 'DF', number: 16, club: "Sheffield United", rarity: 'rare', image: "https://picsum.photos/seed/anel/400/600", age: 27, stats: { goals: 1, assists: 0, appearances: 24 } },
  { id: "BiH_3", name: "Sead Kolašinac", position: 'DF', number: 5, club: "Atalanta", rarity: 'rare', image: "https://picsum.photos/seed/sead/400/600", age: 32, stats: { goals: 3, assists: 5, appearances: 58 } },
  { id: "BiH_4", name: "Amar Dedić", position: 'DF', number: 2, club: "RB Salzburg", rarity: 'rare', image: "https://picsum.photos/seed/amar/400/600", age: 23, stats: { goals: 1, assists: 2, appearances: 15 } },
  { id: "BiH_5", name: "Jusuf Gazibegović", position: 'DF', number: 4, club: "Sturm Graz", rarity: 'common', image: "https://picsum.photos/seed/jusuf/400/600", age: 26, stats: { goals: 0, assists: 1, appearances: 18 } },
  { id: "BiH_6", name: "Benjamin Tahirović", position: 'MF', number: 8, club: "Ajax", rarity: 'rare', image: "https://picsum.photos/seed/benjamin/400/600", age: 23, stats: { goals: 0, assists: 1, appearances: 10 } },
  { id: "BiH_7", name: "Armin Gigović", position: 'MF', number: 18, club: "Holstein Kiel", rarity: 'common', image: "https://picsum.photos/seed/armin/400/600", age: 24, stats: { goals: 0, assists: 0, appearances: 5 } },
  { id: "BiH_8", name: "Denis Huseinbašić", position: 'MF', number: 20, club: "FC Köln", rarity: 'common', image: "https://picsum.photos/seed/denis/400/600", age: 24, stats: { goals: 0, assists: 0, appearances: 4 } },
  { id: "BiH_9", name: "Edin Džeko", position: 'FW', number: 11, club: "Fenerbahçe", rarity: 'legendary', image: "https://picsum.photos/seed/dzeko_sticker/400/600", age: 40, stats: { goals: 65, assists: 28, appearances: 134 } },
  { id: "BiH_10", name: "Ermedin Demirović", position: 'FW', number: 10, club: "Stuttgart", rarity: 'rare', image: "https://picsum.photos/seed/ermedin/400/600", age: 28, stats: { goals: 2, assists: 3, appearances: 26 } },
  { id: "BiH_11", name: "Haris Tabaković", position: 'FW', number: 9, club: "Hoffenheim", rarity: 'common', image: "https://picsum.photos/seed/haris/400/600", age: 31, stats: { goals: 0, assists: 0, appearances: 3 } },
];

export const LEGENDS: Player[] = [
  { id: "Legend_1", name: "Sergej Barbarez", position: 'FW', number: 9, club: "Legend", rarity: 'legendary', image: "https://picsum.photos/seed/barbarez_legend/400/600" },
  { id: "Legend_2", name: "Safet Sušić", position: 'MF', number: 10, club: "Legend", rarity: 'legendary', image: "https://picsum.photos/seed/susic_legend/400/600" },
];

export const SPECIAL_STICKERS: Player[] = [
  { id: "Special_1", name: "World Cup Trophy", position: 'GK', number: 0, club: "FIFA", rarity: 'legendary', image: "https://picsum.photos/seed/trophy_gold/400/600" },
  { id: "Special_2", name: "Official Match Ball", position: 'GK', number: 0, club: "FIFA", rarity: 'legendary', image: "https://picsum.photos/seed/wc_ball/400/600" },
  { id: "Special_3", name: "New York City", position: 'GK', number: 0, club: "Host City", rarity: 'rare', image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=400" },
  { id: "Special_4", name: "Los Angeles", position: 'GK', number: 0, club: "Host City", rarity: 'rare', image: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?auto=format&fit=crop&q=80&w=400" },
  { id: "Special_5", name: "Mexico City", position: 'GK', number: 0, club: "Host City", rarity: 'rare', image: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&q=80&w=400" },
];
