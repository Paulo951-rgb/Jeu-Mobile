export const challengeTemplates = {
  math: {
    easy: {
      name: 'Calcul facile',
      getProblem: () => {
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 20) + 1;
        const ops = ['+', '-'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        if (op === '+') return { text: `${a} + ${b}`, answer: a + b };
        const max = Math.max(a, b);
        const min = Math.min(a, b);
        return { text: `${max} - ${min}`, answer: max - min };
      },
    },
    medium: {
      name: 'Calcul moyen',
      getProblem: () => {
        const a = Math.floor(Math.random() * 50) + 10;
        const b = Math.floor(Math.random() * 12) + 2;
        return { text: `${a} × ${b}`, answer: a * b };
      },
    },
    hard: {
      name: 'Calcul difficile',
      getProblem: () => {
        const a = Math.floor(Math.random() * 30) + 10;
        const b = Math.floor(Math.random() * 20) + 5;
        const c = Math.floor(Math.random() * 50) + 10;
        const ops = ['+', '-'];
        const op1 = ops[Math.floor(Math.random() * ops.length)];
        const op2 = ops[Math.floor(Math.random() * ops.length)];
        const left = op1 === '+' ? a + b : a - b;
        const result = op2 === '+' ? left + c : left - c;
        return { text: `(${a} ${op1} ${b}) ${op2} ${c}`, answer: result };
      },
    },
  },
  recopy: {
    easy: {
      name: 'Recopie facile',
      texts: [
        'Je suis reveille et je commence ma journee.',
        'Aujourdhui est un nouveau jour.',
        'Je suis pret pour cette journee.',
      ],
    },
    medium: {
      name: 'Recopie moyenne',
      texts: [
        'Le soleil se leve et je me leve avec lui pour affronter cette nouvelle journee.',
        'Chaque matin est une nouvelle opportunite de devenir meilleur.',
      ],
    },
    hard: {
      name: 'Recopie difficile',
      texts: [
        'La discipline est le pont entre les objectifs et les accomplissements. Chaque matin, je fais le choix de construire ma vie intentionnellement.',
        'Le succes nest pas un accident. Cest le resultat de la discipline, de leffort constant et de la volonte de progresser chaque jour.',
      ],
    },
  },
};
