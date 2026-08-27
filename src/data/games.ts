export interface Item {
  id: string;
  title: string;
  category: string;
  emoji: string;
  gradient: string;
  badge?: "Top" | "Hot" | "Originals" | "Updated" | "New";
  description: string;
  url: string;
  players?: string;
}

// Helper to generate a stable id from a url
const idFromUrl = (url: string): string => {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 60);
};

// Helper to derive a display title from a url
const titleFromUrl = (url: string): string => {
  let host = url.replace(/^https?:\/\//, "").replace(/^www\./, "");
  if (host.startsWith("sites.google.com/site/")) {
    const sub = host.split("/")[2] || host;
    return sub.replace(/unblockedgames/i, "Unblocked Games ").replace(/\d+/g, (n) => ` ${n}`);
  }
  if (host.includes("/games")) {
    host = host.split("/")[0];
  }
  const parts = host.split("/")[0].split(".");
  if (parts.length >= 2) {
    const name = parts[parts.length - 2];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  return host;
};

// Auto-categorize urls
const categorize = (url: string): string => {
  const u = url.toLowerCase();
  if (u.includes("proxy") || u.includes("whoer") || u.includes("hidester") || u.includes("croxy") || u.includes("bi-pass") || u.includes("pyrus") || u.includes("cosmicproxy")) return "Proxy";
  if (u.includes("illuminating") || u.includes("goilluminating")) return "Illuminating";
  if (u.includes("sites.google.com/site/unblockedgames")) return "Google Sites";
  if (u.includes("unblockedgames") || u.includes("unblockedhub") || u.includes("theunblockedhub") || u.includes("tyronesgames") || u.includes("gamesthatarenotblocked") || u.includes("classroom6x")) return "Unblocked";
  if (u.includes("3kh0") || u.includes("kazwire") || u.includes("radon.games") || u.includes("nebula.com") || u.includes("gfy.com") || u.includes("bl4ckout") || u.includes("crackedgames") || u.includes("degeneracy") || u.includes("doriangames") || u.includes("msgweb") || u.includes("onegamesites") || u.includes("p0xx") || u.includes("platformer.io") || u.includes("shadowgmes") || u.includes("system99") || u.includes("zatoga") || u.includes("hellgames") || u.includes("emeraldbed") || u.includes("prollgames") || u.includes("glaticgames") || u.includes("snorlaxscave") || u.includes("nettleweb") || u.includes("lunaar") || u.includes("macvg") || u.includes("55gms") || u.includes("polarisgames") || u.includes("dotgui") || u.includes("pegleg") || u.includes("smartkidweb")) return "Games Hub";
  if (u.includes("math") || u.includes("coolmath") || u.includes("duckmath") || u.includes("quackprep") || u.includes("teacherease") || u.includes("schoolfacts") || u.includes("gn-math") || u.includes("multiplication") || u.includes("prodigy")) return "Educational";
  if (u.includes("pbs") || u.includes("scratch") || u.includes("abcya") || u.includes("funbrain") || u.includes("playbrain") || u.includes("shawgames") || u.includes("turbowarp") || u.includes("bonk.io") || u.includes("gogy.com") || u.includes("roomrecess") || u.includes("turtlediary") || u.includes("primarygames") || u.includes("mathplayground")) return "Educational";
  if (u.includes("poki") || u.includes("crazygames") || u.includes("kizi")) return "Games Hub";
  if (u.includes("gitlab") || u.includes("bitbucket") || u.includes("codeberg") || u.includes("sourceforge") || u.includes("vercel") || u.includes("netlify") || u.includes("glitch") || u.includes("replit") || u.includes("heroku") || u.includes("render") || u.includes("cyclic") || u.includes("koyeb") || u.includes("fly.io") || u.includes("railway") || u.includes("deno") || u.includes("cloudflare") || u.includes("surge") || u.includes("neocities") || u.includes("supabase") || u.includes("firebase") || u.includes("aws") || u.includes("azure") || u.includes("gcp") || u.includes("digitalocean") || u.includes("linode") || u.includes("vultr") || u.includes("namecheap") || u.includes("godaddy")) return "Dev/Hosting";
  if (u.includes("archlinux") || u.includes("debian") || u.includes("ubuntu") || u.includes("fedora") || u.includes("centos") || u.includes("redhat") || u.includes("suse") || u.includes("almalinux") || u.includes("rockylinux") || u.includes("nixos") || u.includes("voidlinux") || u.includes("gentoo") || u.includes("slackware") || u.includes("freebsd") || u.includes("openbsd") || u.includes("netbsd") || u.includes("illumos") || u.includes("openwrt") || u.includes("fosstodon")) return "Linux/OS";
  if (u.includes("shsgames")) return "Games Hub";
  if (u.includes("teletubbies")) return "Games Hub";
  return "Web";
};

const gradients = [
  "from-purple-800 via-indigo-900 to-black",
  "from-zinc-800 via-neutral-900 to-black",
  "from-stone-800 via-neutral-900 to-black",
  "from-red-800 via-orange-900 to-black",
  "from-amber-800 via-orange-900 to-black",
  "from-cyan-800 via-blue-900 to-black",
  "from-yellow-800 via-amber-900 to-black",
  "from-blue-800 via-indigo-900 to-black",
  "from-red-700 via-orange-800 to-black",
  "from-rose-800 via-red-900 to-black",
  "from-sky-800 via-cyan-900 to-black",
  "from-pink-800 via-purple-900 to-black",
  "from-green-700 via-emerald-800 to-black",
  "from-lime-800 via-green-900 to-black",
  "from-teal-800 via-emerald-900 to-black",
  "from-neutral-800 via-stone-900 to-black",
  "from-violet-800 via-purple-900 to-black",
  "from-indigo-800 via-blue-900 to-black",
  "from-emerald-800 via-teal-900 to-black",
  "from-fuchsia-800 via-pink-900 to-black",
];

const emojiForCategory = (category: string): string => {
  switch (category) {
    case "Proxy": return "🌐";
    case "Illuminating": return "💡";
    case "Google Sites": return "📄";
    case "Unblocked": return "🚪";
    case "Games Hub": return "🎮";
    case "Educational": return "📚";
    case "Dev/Hosting": return "💻";
    case "Linux/OS": return "🐧";
    case "Web": return "🔗";
    default: return "🌟";
  }
};

const descForCategory = (category: string, name: string): string => {
  switch (category) {
    case "Proxy": return `Use ${name} to access blocked content at your school.`;
    case "Illuminating": return `Open ${name} to play unblocked games through the Illuminating network.`;
    case "Google Sites": return `Open ${name} directly from Google Sites to bypass filters.`;
    case "Unblocked": return `Visit ${name} to browse a curated collection of unblocked games.`;
    case "Games Hub": return `Open ${name} for a library of school-friendly games.`;
    case "Educational": return `Open ${name} for fun learning games and activities.`;
    case "Dev/Hosting": return `Visit ${name} for development and hosting tools.`;
    case "Linux/OS": return `Browse ${name} for information about this operating system.`;
    default: return `Visit ${name}.`;
  }
};

const rawUrls: string[] = [
  "https://coolmathgames.com",
  "https://hoodamath.com",
  "https://pbskids.org/games",
  "https://scratch.mit.edu",
  "https://abcya.com",
  "https://funbrain.com",
  "https://playbrain.games",
  "https://shawgames.com",
  "https://poki.com",
  "https://crazygames.com",
  "https://classroom6x.com",
  "https://kizi.com",
  "https://nettleweb.com",
  "https://lunaar.org",
  "https://macvg.com",
  "https://55gms.com",
  "https://polarisgames.com",
  "https://dotgui.com",
  "https://pegleg.com",
  "https://teletubbies.wtf",
  "https://snorlaxscave.com",
  "https://cosmicproxy.com",
  "https://kazwire.com",
  "https://pyrusproxy.com",
  "https://3kh0.com",
  "https://nebula.com",
  "https://gfy.com",
  "https://glaticgames.com",
  "https://prollgames.com",
  "https://emeraldbed.com",
  "https://hellgames.com",
  "https://unblockedgames66.com",
  "https://unblockedgames77.com",
  "https://unblockedgames911.com",
  "https://tyronesgames.com",
  "https://quackprep.org",
  "https://duckmath.org",
  "https://schoolfacts.xyz",
  "https://teacherease.net",
  "https://illuminating.pages.dev",
  "https://illuminating.us",
  "https://illuminating.netlify.app",
  "https://illuminating.onrender.com",
  "https://goilluminating.web.app",
  "https://goilluminating.firebaseapp.com",
  "https://illuminating.surge.sh",
  "https://shsgames.github.io",
  "https://gn-math.github.io",
  "https://bl4ckout.com",
  "https://crackedgames.com",
  "https://degeneracy.com",
  "https://doriangames.com",
  "https://msgweb.com",
  "https://onegamesites.com",
  "https://p0xx.com",
  "https://platformer.io",
  "https://shadowgmes.com",
  "https://smartkidweb.com",
  "https://system99.com",
  "https://zatoga.com",
  "https://bi-pass.com",
  "https://croxyproxy.com",
  "https://hidester.com",
  "https://proxysite.com",
  "https://whoer.net",
  "https://theunblockedhub.com",
  "https://unblockedhub.com",
  "https://radon.games",
  "https://turbowarp.org",
  "https://prodigygame.com",
  "https://arcadeprehacks.com",
  "https://bonk.io",
  "https://gogy.com",
  "https://mathplayground.com",
  "https://multiplication.com",
  "https://primarygames.com",
  "https://roomrecess.com",
  "https://turtlediary.com",
  "https://gamesthatarenotblocked.com",
  "https://unblockedgames.world",
  "https://sites.google.com/site/unblockedgames77",
  "https://sites.google.com/site/unblockedgames66",
  "https://sites.google.com/site/unblockedgames911",
  "https://sites.google.com/site/unblockedgames24h",
  "https://sites.google.com/site/unblockedgames69",
  "https://sites.google.com/site/unblockedgames33",
  "https://sites.google.com/site/unblockedgames55",
  "https://sites.google.com/site/unblockedgames88",
  "https://sites.google.com/site/unblockedgames99",
  "https://sites.google.com/site/unblockedgames100",
  "https://sites.google.com/site/unblockedgames101",
  "https://sites.google.com/site/unblockedgames102",
  "https://sites.google.com/site/unblockedgames103",
  "https://sites.google.com/site/unblockedgames104",
  "https://sites.google.com/site/unblockedgames105",
  "https://sites.google.com/site/unblockedgames106",
  "https://sites.google.com/site/unblockedgames107",
  "https://sites.google.com/site/unblockedgames108",
  "https://sites.google.com/site/unblockedgames109",
  "https://sites.google.com/site/unblockedgames110",
  "https://www.google.com/sites",
  "https://sites.google.com",
  "https://vercel.com",
  "https://netlify.app",
  "https://glitch.com",
  "https://replit.com",
  "https://heroku.com",
  "https://render.com",
  "https://cyclic.sh",
  "https://koyeb.com",
  "https://fly.io",
  "https://railway.com",
  "https://deno.dev",
  "https://cloudflare.com",
  "https://supabase.com",
  "https://firebase.com",
  "https://aws.amazon.com",
  "https://azure.com",
  "https://gcp.com",
  "https://digitalocean.com",
  "https://linode.com",
  "https://vultr.com",
  "https://namecheap.com",
  "https://godaddy.com",
  "https://cloudflarepages.com",
  "https://surge.sh",
  "https://neocities.org",
  "https://gitlab.io",
  "https://bitbucket.io",
  "https://codeberg.org",
  "https://sourceforge.net",
  "https://fosstodon.org",
  "https://openwrt.org",
  "https://archlinux.org",
  "https://debian.org",
  "https://ubuntu.com",
  "https://fedora.org",
  "https://centos.org",
  "https://redhat.com",
  "https://suse.com",
  "https://almalinux.org",
  "https://rockylinux.org",
  "https://nixos.org",
  "https://voidlinux.org",
  "https://gentoo.org",
  "https://slackware.com",
  "https://freebsd.org",
  "https://openbsd.org",
  "https://netbsd.org",
  "https://illumos.org",
];

const seen = new Set<string>();
const uniqueUrls = rawUrls.filter((u) => {
  const key = u.replace(/^https?:\/\//, "").replace(/^www\./, "").toLowerCase();
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

const playersFor = (i: number): string => {
  const base = 30 + ((i * 17) % 220);
  return `${base}.${(i * 3) % 10}k`;
};

const badgeFor = (i: number, category: string): Item["badge"] | undefined => {
  if (i % 23 === 0) return "Top";
  if (i % 17 === 0) return "Hot";
  if (i % 29 === 0) return "New";
  if (i % 31 === 0) return "Originals";
  if (i % 37 === 0) return "Updated";
  return undefined;
};

export const ITEMS_DATA: Item[] = uniqueUrls.map((url, i) => {
  const category = categorize(url);
  const title = titleFromUrl(url);
  return {
    id: idFromUrl(url) || `item-${i}`,
    title,
    category,
    emoji: emojiForCategory(category),
    gradient: gradients[i % gradients.length],
    badge: badgeFor(i, category),
    description: descForCategory(category, title),
    url,
    players: playersFor(i),
  };
});