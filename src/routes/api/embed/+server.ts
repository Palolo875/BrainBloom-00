import { json } from '@sveltejs/kit';
import { HF_TOKEN } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { text } = await request.json();

		if (!text) {
			return json({ error: 'Text is required' }, { status: 400 });
		}

		// Appel à l'API d'inférence Hugging Face pour le modèle all-MiniLM-L6-v2
		const response = await fetch(
			'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2',
			{
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${HF_TOKEN}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					inputs: text,
					options: { wait_for_model: true }
				})
			}
		);

		if (!response.ok) {
			console.error('Hugging Face API error:', response.status, await response.text());
			return json({ error: 'Failed to generate embedding' }, { status: 500 });
		}

		const embedding = await response.json();
		
		// Vérifier que l'embedding est un tableau de 384 dimensions
		if (!Array.isArray(embedding) || embedding.length !== 384) {
			console.error('Invalid embedding format:', typeof embedding, embedding?.length);
			return json({ error: 'Invalid embedding format' }, { status: 500 });
		}

		return json({ embedding });

	} catch (error) {
		console.error('Embedding API error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};