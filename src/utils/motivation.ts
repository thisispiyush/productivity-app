const messages = [
  'Small wins compound. Ship one meaningful thing today.',
  'Momentum beats motivation—start tiny, stay consistent.',
  'Your future self is built in the next 25 minutes.',
  'Less noise, more clarity. One task, then the next.',
  'Consistency is a superpower. Keep the streak alive.',
]

export function getMotivationMessage(seed: number) {
  return messages[seed % messages.length]
}

