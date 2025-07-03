export default async function PlayPage({
    params,
}: {
    params: Promise<{ share_code: string }>;
}) {
    const resolvedParams = await params;
    return <p>Play Page {resolvedParams.share_code}</p>;
}
