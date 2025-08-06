import { Card, CardContent } from '@/components/ui/card'
import { Code, Zap, GitBranch, Terminal } from 'lucide-react'

export function Features() {
    return (
        <section className="bg-gray-50 py-16 md:py-32 dark:bg-transparent">
            <div className="mx-auto max-w-3xl lg:max-w-5xl px-6">
                <div className="relative">
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="relative overflow-hidden">
                            <CardContent className="pt-6">
                                <div className="relative mx-auto flex aspect-square size-16 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                                    <Code className="m-auto size-8" strokeWidth={1} />
                                </div>
                                <div className="relative z-10 mt-6 space-y-2 text-center">
                                    <h2 className="text-lg font-medium transition">Code, Simply</h2>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="relative overflow-hidden">
                            <CardContent className="pt-6">
                                <div className="relative mx-auto flex aspect-square size-16 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                                    <Zap className="m-auto size-8" strokeWidth={1} />
                                </div>
                                <div className="relative z-10 mt-6 space-y-2 text-center">
                                    <h2 className="text-lg font-medium transition">Lightning Fast</h2>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="relative overflow-hidden">
                            <CardContent className="pt-6">
                                <div className="relative mx-auto flex aspect-square size-16 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                                    <GitBranch className="m-auto size-8" strokeWidth={1} />
                                </div>
                                <div className="relative z-10 mt-6 space-y-2 text-center">
                                    <h2 className="text-lg font-medium transition">Version Control</h2>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="relative overflow-hidden">
                            <CardContent className="pt-6">
                                <div className="relative mx-auto flex aspect-square size-16 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                                    <Terminal className="m-auto size-8" strokeWidth={1} />
                                </div>
                                <div className="relative z-10 mt-6 space-y-2 text-center">
                                    <h2 className="text-lg font-medium transition">Smart Debugging</h2>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="relative overflow-hidden">
                            <CardContent className="pt-6">
                                <div className="relative mx-auto flex aspect-square size-16 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                                    <Code className="m-auto size-8" strokeWidth={1} />
                                </div>
                                <div className="relative z-10 mt-6 space-y-2 text-center">
                                    <h2 className="text-lg font-medium transition">Multi-Language</h2>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="relative overflow-hidden">
                            <CardContent className="pt-6">
                                <div className="relative mx-auto flex aspect-square size-16 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                                    <Zap className="m-auto size-8" strokeWidth={1} />
                                </div>
                                <div className="relative z-10 mt-6 space-y-2 text-center">
                                    <h2 className="text-lg font-medium transition">Real-time Sync</h2>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}
