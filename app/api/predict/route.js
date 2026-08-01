export async function POST(req) {
  const formData = await req.formData();

  const response = await fetch(
    "https://grain-classification-model.onrender.com/predict",
    {
      method: "POST",
      headers: {
        "x-api-key": process.env.AI_API_KEY,
      },
      body: formData,
    }
  );

  const data = await response.json();
  return Response.json(data);
}