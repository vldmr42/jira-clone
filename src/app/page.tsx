import { Button } from '@/components/ui/button';

export default function Home() {
    return (
        <div className="flex gap-6">
            <Button>Primary</Button>
            <Button variant={'secondary'}>Secondary</Button>
            <Button variant={'ghost'}>Ghost</Button>
            <Button variant={'outline'}>Outline</Button>
            <Button variant={'destructive'}>Destructive</Button>
            <Button variant={'muted'}>Muted</Button>
            <Button variant={'tertiary'}>Tertiary</Button>
        </div>
    );
}
