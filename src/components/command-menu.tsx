"use client"

import * as React from "react"
import { recordAchievement } from "@/lib/playground/use-achievements"
import { useTheme } from "next-themes"
import {
    LayoutDashboard,
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

const ITEM_CLASS = "rounded-lg py-3 cursor-pointer"
const SHORTCUT_CLASS = "font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700"

interface CommandDefinition {
    id: string
    label: string
    /** Shift + this key fires the command globally. */
    hotkey: string
    group: CommandGroup
    icon: React.ComponentType<{ className?: string }>
    /** Extra classes for the palette item. */
    itemClassName?: string
    /** Extra classes for the palette icon. */
    iconClassName?: string
    run: () => unknown
}

type CommandGroup = "Sections" | "General" | "Theme"

const GROUP_ORDER: CommandGroup[] = ["Sections", "General", "Theme"]

export function CommandMenu() {
    const [open, setOpen] = React.useState(false)
    const { setTheme } = useTheme()
    const router = useRouter()

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        recordAchievement("commander")
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

    // The single source of truth: both the palette below and the global
    // shift+key handler read from this one table. Add a command once.
    const commands = React.useMemo<CommandDefinition[]>(() => [
        { id: "experience", label: "Experience", hotkey: "e", group: "Sections", icon: Briefcase, run: () => navigateToSection("experience") },
        { id: "projects", label: "Projects", hotkey: "p", group: "Sections", icon: Code, run: () => navigateToSection("projects") },
        { id: "opensource", label: "Open Source", hotkey: "o", group: "Sections", icon: SiGithub, run: () => navigateToSection("opensource") },
        { id: "skills", label: "Stack", hotkey: "s", group: "Sections", icon: BookOpen, run: () => navigateToSection("skills") },
        {
            id: "playground",
            label: "Blueprint Playground",
            hotkey: "g",
            group: "Sections",
            icon: Boxes,
            itemClassName: "text-cyan-400 font-medium",
            iconClassName: "text-cyan-400",
            run: () => router.push("/playground"),
        },
        {
            id: "copy-link",
            label: "Copy Link",
            hotkey: "c",
            group: "General",
            icon: Copy,
            run: () => {
                navigator.clipboard.writeText(window.location.href)
            },
        },
        { id: "light-mode", label: "Light Mode", hotkey: "t", group: "Theme", icon: Sun, run: () => setTheme("light") },
        { id: "dark-mode", label: "Dark Mode", hotkey: "d", group: "Theme", icon: Moon, run: () => setTheme("dark") },
    ], [navigateToSection, router, setTheme])

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
                const command = commands.find((c) => c.hotkey === e.key.toLowerCase())
                if (command) {
                    e.preventDefault()
                    runCommand(command.run)
                }
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [open, commands, runCommand])

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open command palette"
                title="Open command palette (⌘K)"
                className="relative group cursor-pointer transition-all duration-300 active:scale-95"
            >
                {/* Outer border wrapper matching View All style */}
                <div className="absolute -inset-[4.5px] border border-black/5 dark:border-white/5 rounded-[9px] pointer-events-none transition-colors duration-300 group-hover:border-black/10 dark:group-hover:border-white/10" />

                <div className="relative flex items-center gap-1.5 px-3 py-1 bg-zinc-50 hover:bg-zinc-100 dark:bg-[#171717] dark:hover:bg-[#1e1e1e] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-[5px] text-[11px] font-medium transition-all duration-300 border border-black/5 dark:border-white/5 shadow-sm shadow-black/20 dark:shadow-lg dark:shadow-black/80 font-mono">
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

                <CommandInput aria-label="Search actions, commands, or sections" placeholder="Search for actions..." className="border-none focus:ring-0" />

                <CommandList className="p-2">
                    <CommandEmpty>No results found.</CommandEmpty>

                    {GROUP_ORDER.map((group, groupIndex) => {
                        const groupCommands = commands.filter((c) => c.group === group)
                        if (groupCommands.length === 0) return null

                        return (
                            <React.Fragment key={group}>
                                {groupIndex > 0 && <CommandSeparator className="my-2" />}
                                <CommandGroup heading={group}>
                                    {groupCommands.map((command) => {
                                        const Icon = command.icon
                                        return (
                                            <CommandItem
                                                key={command.id}
                                                onSelect={() => runCommand(command.run)}
                                                className={`${ITEM_CLASS} ${command.itemClassName || ""}`}
                                            >
                                                <Icon className={`mr-2 h-4 w-4 ${command.iconClassName || "text-zinc-500"}`} />
                                                <span>{command.label}</span>
                                                <CommandShortcut className={SHORTCUT_CLASS}>
                                                    shift + {command.hotkey.toUpperCase()}
                                                </CommandShortcut>
                                            </CommandItem>
                                        )
                                    })}
                                </CommandGroup>
                            </React.Fragment>
                        )
                    })}
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
