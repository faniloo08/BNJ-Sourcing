"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Building2, MapPin, Mail, Globe, Calendar, Users, DollarSign } from "lucide-react"
import type { FoundProfile } from "./search-page-content"

interface ProfileDetailsDialogProps {
    profile: FoundProfile | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ProfileDetailsDialog({ profile, open, onOpenChange }: ProfileDetailsDialogProps) {
    if (!profile || !profile.profileData) return null

    const data = profile.profileData
    // Safely extract nested company data or fallback
    const companyName = data.company_name || data.compnay || ""
    const companyDesc = data.company_description
    const experiences = data.experiences || [] // Assuming array if available, or just use current role
    const skills = data.keywords ? data.keywords.split(",") : []

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-xl">{profile.name}</DialogTitle>
                    <DialogDescription className="text-base font-medium text-foreground">
                        {profile.title}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-6">
                        {/* Contact & Location Info */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{profile.location || "Localisation inconnue"}</span>
                            </div>
                            {profile.email && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                    <a href={`mailto:${profile.email}`} className="hover:underline">{profile.email}</a>
                                </div>
                            )}
                        </div>

                        {/* Current Company */}
                        {companyName && (
                            <div className="rounded-lg border p-4 bg-muted/30">
                                <div className="flex items-start gap-3">
                                    <Building2 className="h-5 w-5 mt-1 text-primary" />
                                    <div className="space-y-2">
                                        <h3 className="font-semibold">{companyName}</h3>
                                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                            {data.company_industry && <span>{data.company_industry}</span>}
                                            {data.company_size && (
                                                <span className="flex items-center gap-1">
                                                    <Users className="h-3 w-3" /> {data.company_size} employés
                                                </span>
                                            )}
                                            {data.company_founded_year && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" /> Fonde en {data.company_founded_year}
                                                </span>
                                            )}
                                            {data.company_website && (
                                                <span className="flex items-center gap-1">
                                                    <Globe className="h-3 w-3" />
                                                    <a href={data.company_website} target="_blank" rel="noopener noreferrer" className="hover:underline">Site web</a>
                                                </span>
                                            )}
                                        </div>
                                        {companyDesc && (
                                            <p className="text-sm text-muted-foreground line-clamp-4 hover:line-clamp-none transition-all">
                                                {companyDesc}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* About / Summary */}
                        {data.summary && (
                            <div className="space-y-2">
                                <h4 className="font-semibold">À propos</h4>
                                <p className="text-sm text-muted-foreground">{data.summary}</p>
                            </div>
                        )}

                        {/* Keywords / Skills */}
                        {skills.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="font-semibold">Compétences & Mots-clés</h4>
                                <div className="flex flex-wrap gap-2">
                                    {skills.slice(0, 15).map((skill: string, i: number) => (
                                        <Badge key={i} variant="secondary" className="font-normal capitalize">
                                            {skill.trim()}
                                        </Badge>
                                    ))}
                                    {skills.length > 15 && (
                                        <Badge variant="outline" className="font-normal">+{skills.length - 15} autres</Badge>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Footer Actions */}
                        <div className="pt-4 flex justify-end gap-2">
                            {profile.profileUrl && (
                                <a
                                    href={profile.profileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                                >
                                    Voir sur LinkedIn
                                </a>
                            )}
                        </div>

                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
