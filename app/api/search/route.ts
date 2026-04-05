import schools from "@/data/schools.json";

export async function POST(req: Request) {
  const { query, state, city } = await req.json();

  let results = schools;

  if (state) {
    results = results.filter(
      (school) => school.state.toLowerCase() === state.toLowerCase()
    );
  }

  if (city) {
    results = results.filter(
      (school) => school.city.toLowerCase() === city.toLowerCase()
    );
  }

  if (!state && !city && query) {
    results = schools.filter((school) => {
      const location = `${school.city}, ${school.state}`.toLowerCase();
      return location.includes(query.toLowerCase());
    });
  }

  return Response.json(results);
}