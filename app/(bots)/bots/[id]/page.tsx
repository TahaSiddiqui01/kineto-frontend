import BotPage from '@/screens/bot'

interface PageProps {
  params: Promise<{ id: string }>
}

async function page({ params }: PageProps) {
  const { id } = await params
  return <BotPage botId={id} />
}

export default page
