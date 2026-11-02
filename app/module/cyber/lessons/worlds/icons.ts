import {
  AlertTriangle, Apple, Archive, Award, Baby, Banknote, BarChart3, BadgeCheck, Battery, Bell, Binary, Bike, Blocks, Book, BookOpen, Bookmark, Bot, Brain, Brackets, Bug, Building2, Bus,
  Calculator, Calendar, Camera, Car, Cat, Check, CircleHelp, ClipboardCheck, ClipboardList, Clock, Cloud, Code, Coins, Compass, Component, Contact, Cookie, Copy, Cpu, CreditCard, Crop,
  Database, Dice5, Dog, Download, Droplets, Eraser, Eye, EyeOff, File, FileText, FileWarning, Film, Filter, Fingerprint, Fish, Flag, Flame, Flower2, Folder, FolderOpen, Footprints,
  Gamepad2, Gauge, Gem, Ghost, Gift, Glasses, Globe, Grid3x3, HandCoins, Handshake, Hammer, HardDrive, Hash, Headphones, Heart, History, Home, Hourglass,
  Image, Inbox, Info, Key, KeyRound, Keyboard, Laptop, Layers, Leaf, Lightbulb, LineChart, Link, Link2, ListChecks, ListOrdered, Lock, Mail, Map, MapPin, Megaphone, MessageCircle, MessageSquare, Mic, Minus, Monitor, MonitorSmartphone, Moon, Mouse, Music,
  Navigation, Network, Newspaper, Package, Paperclip, Pencil, Percent, Phone, PhoneCall, PhoneOff, PieChart, Plane, Plug, Plus, Power, Presentation, Printer, Puzzle, QrCode, Quote,
  Radar, Radio, Receipt, ReceiptText, RefreshCw, Repeat, Rocket, RotateCcw, Route, Router, Ruler, Save, Scale, ScanFace, School, Scissors, Search, Send, Server, Settings, Share2, Shapes, Shield, ShieldAlert, ShieldCheck, ShieldOff,
  ShoppingBag, ShoppingCart, Shuffle, Siren, Skull, SlidersHorizontal, Smartphone, Smile, Frown, Sparkles, Speaker, Stamp, Star, Store, Sun, Tablet, Tag, Target, Tent, Terminal, ThumbsDown, ThumbsUp, Ticket, Timer, ToggleLeft, ToggleRight, Trash2, Trophy, Truck, Tv,
  Unlink, Unlock, Upload, User, UserCheck, UserPlus, UserX, Users, Variable, Video, Volume2, Wallet, Webcam, Wifi, WifiOff, Workflow, Wrench, X, Zap, ArrowRight, ArrowDown, ArrowLeftRight, ArrowUpDown, Sigma, Divide, Equal, Infinity as InfinityIcon, ArrowUpRight, ArrowDownLeft, LifeBuoy, ScanLine, TrendingUp, Languages,
  type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  alert: AlertTriangle, apple: Apple, archive: Archive, award: Award, baby: Baby, banknote: Banknote, bars: BarChart3, verified: BadgeCheck, battery: Battery, bell: Bell, binary: Binary, bike: Bike, blocks: Blocks, book: Book,
  "book-open": BookOpen, bookmark: Bookmark, bot: Bot, brain: Brain, brackets: Brackets, bug: Bug, building: Building2, bus: Bus,
  calc: Calculator, calendar: Calendar, camera: Camera, car: Car, cat: Cat, check: Check, help: CircleHelp, "clipboard-ok": ClipboardCheck, clipboard: ClipboardList, clock: Clock, cloud: Cloud, code: Code, coins: Coins, compass: Compass,
  component: Component, contact: Contact, cookie: Cookie, copy: Copy, cpu: Cpu, card: CreditCard, crop: Crop,
  db: Database, dice: Dice5, dog: Dog, download: Download, drops: Droplets, eraser: Eraser, eye: Eye, "eye-off": EyeOff, file: File, doc: FileText, "file-warn": FileWarning, film: Film, filter: Filter, finger: Fingerprint, fish: Fish, flag: Flag, flame: Flame,
  flower: Flower2, folder: Folder, "folder-open": FolderOpen, feet: Footprints, game: Gamepad2, gauge: Gauge, gem: Gem, ghost: Ghost, gift: Gift, glasses: Glasses, globe: Globe, grid: Grid3x3, "hand-coins": HandCoins, handshake: Handshake,
  hammer: Hammer, disk: HardDrive, hash: Hash, headphones: Headphones, heart: Heart, history: History, home: Home, hourglass: Hourglass,
  image: Image, inbox: Inbox, info: Info, key: Key, "key-round": KeyRound, keyboard: Keyboard, laptop: Laptop, layers: Layers, leaf: Leaf, idea: Lightbulb, line: LineChart, link: Link, link2: Link2, checks: ListChecks, list: ListOrdered,
  lock: Lock, mail: Mail, map: Map, pin: MapPin, megaphone: Megaphone, chat: MessageCircle, msg: MessageSquare, mic: Mic, minus: Minus, monitor: Monitor, devices: MonitorSmartphone, moon: Moon, mouse: Mouse, music: Music,
  nav: Navigation, network: Network, news: Newspaper, box: Package, clip: Paperclip, pencil: Pencil, percent: Percent, phone: Phone, call: PhoneCall, "call-off": PhoneOff, pie: PieChart, plane: Plane, plug: Plug, plus: Plus, power: Power,
  slides: Presentation, printer: Printer, puzzle: Puzzle, qr: QrCode, quote: Quote, radar: Radar, radio: Radio, receipt: Receipt, bill: ReceiptText, refresh: RefreshCw, repeat: Repeat, rocket: Rocket, undo: RotateCcw, route: Route, router: Router,
  ruler: Ruler, save: Save, scale: Scale, face: ScanFace, school: School, scissors: Scissors, search: Search, send: Send, server: Server, settings: Settings, share: Share2, shapes: Shapes, shield: Shield, "shield-alert": ShieldAlert,
  "shield-ok": ShieldCheck, "shield-off": ShieldOff, bag: ShoppingBag, cart: ShoppingCart, shuffle: Shuffle, siren: Siren, skull: Skull, sliders: SlidersHorizontal, mobile: Smartphone, smile: Smile, frown: Frown, sparkles: Sparkles,
  speaker: Speaker, stamp: Stamp, star: Star, store: Store, sun: Sun, tablet: Tablet, tag: Tag, target: Target, tent: Tent, terminal: Terminal, down: ThumbsDown, up: ThumbsUp, ticket: Ticket, timer: Timer, "toggle-off": ToggleLeft,
  "toggle-on": ToggleRight, trash: Trash2, trophy: Trophy, truck: Truck, tv: Tv, unlink: Unlink, unlock: Unlock, upload: Upload, user: User, "user-ok": UserCheck, "user-add": UserPlus, "user-x": UserX, users: Users, variable: Variable,
  video: Video, volume: Volume2, wallet: Wallet, webcam: Webcam, wifi: Wifi, "wifi-off": WifiOff, workflow: Workflow, wrench: Wrench, x: X, zap: Zap, arrow: ArrowRight, "arrow-down": ArrowDown, swap: ArrowLeftRight, "swap-v": ArrowUpDown,
  out: ArrowUpRight, in: ArrowDownLeft, life: LifeBuoy, languages: Languages, scan: ScanLine, trending: TrendingUp, droplets: Droplets, package: Package, sigma: Sigma, divide: Divide, equal: Equal, infinity: InfinityIcon,
};
export const iconFor = (name?: string): LucideIcon | null => (name ? ICONS[name] ?? null : null);
