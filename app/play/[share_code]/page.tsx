import PlayStage from "./PlayStage";

export default async function PlayPage({
    params,
}: {
    params: Promise<{ share_code: string }>;
}) {
    const resolvedParams = await params;
    return <PlayStage share_code={resolvedParams.share_code} />;
}
