"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
    LayoutDashboard,
    FileText,
    Moon,
    Sun,
    Code,
    ArrowUp,
    ArrowDown,
    CornerDownLeft,
    Copy,
    Briefcase,
    BookOpen,
    Boxes
} from "lucide-react"
import { SiGithub } from "react-icons/si"

import { useRouter } from "next/navigation"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"

export function CommandMenu() {
    const [open, setOpen] = React.useState(false)
    const { setTheme } = useTheme()
    const router = useRouter()

    const openExternal = React.useCallback((url: string) => {
        const opened = window.open(url, "_blank", "noopener,noreferrer")
        if (!opened) window.location.assign(url)
    }, [])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    const navigateToSection = React.useCallback((sectionId: string) => {
        setOpen(false)
        if (window.location.pathname === "/") {
            window.location.hash = `#${sectionId}`
            const element = document.getElementById(sectionId)
            if (element) {
                element.scrollIntoView({ behavior: "smooth" })
            }
        } else {
            router.push(`/#${sectionId}`)
        }
    }, [router])

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
                return
            }

            const target = e.target as HTMLElement;
            const isTypingField =
                target.isContentEditable ||
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.tagName === 'SELECT'

            // If user is typing inside an input/textarea when the command menu is CLOSED, don't trigger shortcuts
            if (isTypingField && !open) {
                return
            }

            if (e.shiftKey) {
                const key = e.key.toLowerCase()

                // Navigation
                if (key === 'e') {
                    e.preventDefault()
                    navigateToSection("experience")
                } else if (key === 'p') {
                    e.preventDefault()
                    navigateToSection("projects")
                } else if (key === 'o') {
                    e.preventDefault()
                    navigateToSection("opensource")
                } else if (key === 's') {
                    e.preventDefault()
                    navigateToSection("skills")
                } else if (key === 'g') {
                    e.preventDefault()
                    runCommand(() => router.push("/playground"))
                }

                // General
                else if (key === 'c') {
                    e.preventDefault()
                    runCommand(() => navigator.clipboard.writeText(window.location.href))
                }

                // Theme
                else if (key === 't') {
                    e.preventDefault()
                    runCommand(() => setTheme("light"))
                } else if (key === 'd') {
                    e.preventDefault()
                    runCommand(() => setTheme("dark"))
                }
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [open, navigateToSection, router, runCommand, setTheme])

    return (
        <>
            <button 
                onClick={() => setOpen(true)}
                className="relative group cursor-pointer transition-all duration-300 active:scale-95"
            >
                {/* Outer border wrapper matching View All style */}
                <div className="absolute -inset-[4.5px] border border-black/5 dark:border-white/5 rounded-[9px] pointer-events-none transition-colors duration-300 group-hover:border-black/10 dark:group-hover:border-white/10" />
                
                <div className="relative flex items-center gap-1.5 px-3 py-1 bg-zinc-50 hover:bg-zinc-100 dark:bg-[#09090b] dark:hover:bg-[#121214] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-[5px] text-[11px] font-medium transition-all duration-300 border border-black/5 dark:border-white/5 shadow-sm shadow-black/20 dark:shadow-lg dark:shadow-black/80 font-mono">
                    <span className="leading-none mt-[0.5px]">⌘</span>
                    <span className="leading-none mt-[0.5px]">K</span>
                </div>
            </button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                {/* Header Section */}
                <div className="flex items-center gap-4 p-4 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                        <LayoutDashboard className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Navigation Menu</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Quickly jump to sections or actions</p>
                    </div>
                </div>

                <CommandInput placeholder="Search for actions..." className="border-none focus:ring-0" />

                <CommandList className="p-2">
                    <CommandEmpty>No results found.</CommandEmpty>

                    <CommandGroup heading="Sections">
                        <CommandItem onSelect={() => navigateToSection("experience")} className="rounded-lg py-3 cursor-pointer">
                            <Briefcase className="mr-2 h-4 w-4 text-zinc-500" />
                            <span>Experience</span>
                            <CommandShortcut className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">shift + E</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => navigateToSection("projects")} className="rounded-lg py-3 cursor-pointer">
                            <Code className="mr-2 h-4 w-4 text-zinc-500" />
                            <span>Projects</span>
                            <CommandShortcut className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">shift + P</CommandShortcut>
                        </CommandItem>

                        <CommandItem onSelect={() => navigateToSection("opensource")} className="rounded-lg py-3 cursor-pointer">
                            <SiGithub className="mr-2 h-4 w-4 text-zinc-500" />
                            <span>Open Source</span>
                            <CommandShortcut className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">shift + O</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => navigateToSection("skills")} className="rounded-lg py-3 cursor-pointer">
                            <BookOpen className="mr-2 h-4 w-4 text-zinc-500" />
                            <span>Skills</span>
                            <CommandShortcut className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">shift + S</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/playground"))} className="rounded-lg py-3 cursor-pointer text-cyan-400 font-medium">
                            <Boxes className="mr-2 h-4 w-4 text-cyan-400" />
                            <span>Blueprint Playground</span>
                            <CommandShortcut className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">shift + G</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator className="my-2" />

                    <CommandGroup heading="General">
                        <CommandItem onSelect={() => runCommand(() => {
                            navigator.clipboard.writeText(window.location.href)
                        })} className="rounded-lg py-3 cursor-pointer">
                            <Copy className="mr-2 h-4 w-4 text-zinc-500" />
                            <span>Copy Link</span>
                            <CommandShortcut className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">shift + C</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator className="my-2" />

                    <CommandGroup heading="Theme">
                        <CommandItem onSelect={() => runCommand(() => setTheme("light"))} className="rounded-lg py-3 cursor-pointer">
                            <Sun className="mr-2 h-4 w-4 text-zinc-500" />
                            <span>Light Mode</span>
                            <CommandShortcut className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">shift + T</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme("dark"))} className="rounded-lg py-3 cursor-pointer">
                            <Moon className="mr-2 h-4 w-4 text-zinc-500" />
                            <span>Dark Mode</span>
                            <CommandShortcut className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">shift + D</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-4 text-[10px] text-zinc-500">
                        <div className="flex items-center gap-1">
                            <ArrowUp className="w-3 h-3" />
                            <ArrowDown className="w-3 h-3" />
                            <span>to navigate</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <CornerDownLeft className="w-3 h-3" />
                            <span>to select</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                        <span className="font-mono">esc</span>
                        <span>to close</span>
                    </div>
                </div>
            </CommandDialog>
        </>
    )
}
