import type { ServiceCategory, Trainer } from './types'

export const serviceCategories: ServiceCategory[] = [
  '1-on-1 Yoga',
  'Prenatal Yoga',
  'Couples Yoga',
  'Therapy Yoga',
  'Meditation',
]

export const trainers: Trainer[] = [
  {
    id: 'tr_ishita',
    name: 'Ishita Kapur',
    specialty: 'Vinyasa & Hatha Expert',
    experience: '8 years experience',
    category: '1-on-1 Yoga',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDxOvBeCOKeWkQTX2rCUclEBML5LAxRI5BNNW4L4GyK5a-HiSRg01dVukkQyBwzqwCdKcRda9ArpjlEmuJ1LwcB_hkTSyc8yeReVCs5Z4in1AsNgPq0iNvjKWrtnIr273zrdAAXxWr170QSaMo5Siw_bl9xUd6ojuJ4JIrvDUqQXkHbcAsr2K1km8HHGCsy3HGAHIogHR-5lK45Neq1HMU3EkQtXs0jBGOrKvpkI8LXlybxxZvMhHuKVpo6ySIfVYBJC2DLm69j6Kw',
    rating: 4.9,
  },
  {
    id: 'tr_arjun',
    name: 'Arjun Mehta',
    specialty: 'Therapy & Healing',
    experience: '11 years experience',
    category: 'Therapy Yoga',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBYTNXDhEq74jfJFFMQ5GKdMK2J5HyT13wNgJFEZiS0boSR8x5n4e0OwFj0KL2FeQa1cfNt_xg61NKMP-6CwHpCdRiFxALsBy5f24zPx5T5Mfl9YgkMcWk56sIrTLJBzCgkvxKMNG6DBXHK6tk4Z7MwjfyoHKQZXhMDsR6_BAG4_YBA6IzI3SLLryesu6MGiMjiTAAQcBh0IxrkW7ZnZyp4LutIrZlKnpO1CMCBPW5iEPG8TLoOqtl_TVsa5bXzanmhgHkVODMbmgs',
    rating: 4.8,
  },
  {
    id: 'tr_sanya',
    name: 'Sanya Verma',
    specialty: 'Mindfulness & Breathwork',
    experience: '6 years experience',
    category: 'Meditation',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCf6_CqHuTdgvEg9XXpxrVmiYKaDC7031MrFSP0Nob8YvCtSSnUj8eEkxwny5J9Z5KIUr4uqO6dOstNbaq1Jc0Rn6uR96qpcJJGUPM9vVTjMf-pbOXLQoaxJNRu2THChdqTW3P_VpBgi4lfJ64eve3AvrqRtq_0PtVJW8C6k5OL7VsyflJ5dw5AXvLcUwqk6fe13W6mAE1UR4KgrAsfmmS5yuN8fgBWcIoGq0QWTHZ9GHbryacrgzleM1tcUYJUyaQ5_xfqgAc4xLE',
    rating: 5.0,
  },
  {
    id: 'tr_maya',
    name: 'Maya Nair',
    specialty: 'Prenatal Yoga Specialist',
    experience: '9 years experience',
    category: 'Prenatal Yoga',
    image: 'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
  },
  {
    id: 'tr_rohan',
    name: 'Rohan Iyer',
    specialty: 'Couples Flow Coach',
    experience: '7 years experience',
    category: 'Couples Yoga',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&auto=format&fit=crop&q=80',
    rating: 4.7,
  },
  {
    id: 'tr_neha',
    name: 'Neha Rao',
    specialty: 'Private Alignment Coach',
    experience: '10 years experience',
    category: '1-on-1 Yoga',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
    rating: 4.9,
  },
]
