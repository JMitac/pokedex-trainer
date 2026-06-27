/**
 * @file trainer.schemas.test.ts
 * @layer Features / Trainer / Schemas / Tests
 *
 * Pruebas unitarias de los schemas de validación yup.
 * Verifican que las reglas de negocio del formulario son correctas.
 */

import { step1Schema, step2Schema, trainerSchema } from './trainer.schemas';

// ---------------------------------------------------------------------------
// Step 1 Schema
// ---------------------------------------------------------------------------

describe('step1Schema — fullName', () => {
  it('acepta un nombre válido', async () => {
    await expect(
      step1Schema.validateAt('fullName', { fullName: 'Ash Ketchum' })
    ).resolves.toBe('Ash Ketchum');
  });

  it('rechaza nombre vacío', async () => {
    await expect(
      step1Schema.validateAt('fullName', { fullName: '' })
    ).rejects.toThrow('El nombre completo es requerido');
  });

  it('rechaza nombre con menos de 3 caracteres', async () => {
    await expect(
      step1Schema.validateAt('fullName', { fullName: 'As' })
    ).rejects.toThrow('al menos 3 caracteres');
  });

  it('rechaza nombre con más de 50 caracteres', async () => {
    await expect(
      step1Schema.validateAt('fullName', {
        fullName: 'A'.repeat(51),
      })
    ).rejects.toThrow('50 caracteres');
  });

  it('rechaza nombre con números', async () => {
    await expect(
      step1Schema.validateAt('fullName', { fullName: 'Ash123' })
    ).rejects.toThrow('solo puede contener letras');
  });

  it('acepta nombre con tildes y ñ', async () => {
    await expect(
      step1Schema.validateAt('fullName', { fullName: 'José Ñoño' })
    ).resolves.toBe('José Ñoño');
  });
});

describe('step1Schema — age', () => {
  it('acepta edad válida de 10 años', async () => {
    await expect(
      step1Schema.validateAt('age', { age: 10 })
    ).resolves.toBe(10);
  });

  it('acepta edad adulta', async () => {
    await expect(
      step1Schema.validateAt('age', { age: 25 })
    ).resolves.toBe(25);
  });

  it('rechaza edad menor a 10', async () => {
    await expect(
      step1Schema.validateAt('age', { age: 9 })
    ).rejects.toThrow('al menos 10 años');
  });

  it('rechaza edad 0', async () => {
    await expect(
      step1Schema.validateAt('age', { age: 0 })
    ).rejects.toThrow('al menos 10 años');
  });

  it('rechaza edad mayor a 120', async () => {
    await expect(
      step1Schema.validateAt('age', { age: 121 })
    ).rejects.toThrow('edad válida');
  });

  it('rechaza edad vacía', async () => {
    await expect(
      step1Schema.validateAt('age', { age: undefined })
    ).rejects.toThrow('requerida');
  });

  it('rechaza edad decimal', async () => {
    await expect(
      step1Schema.validateAt('age', { age: 10.5 })
    ).rejects.toThrow('entero');
  });

  it('rechaza string en lugar de número', async () => {
    await expect(
      step1Schema.validateAt('age', { age: 'diez' as unknown as number })
    ).rejects.toThrow('número');
  });
});

describe('step1Schema — email', () => {
  it('acepta email válido', async () => {
    await expect(
      step1Schema.validateAt('email', { email: 'ash@pokemon.com' })
    ).resolves.toBe('ash@pokemon.com');
  });

  it('rechaza email vacío', async () => {
    await expect(
      step1Schema.validateAt('email', { email: '' })
    ).rejects.toThrow('requerido');
  });

  it('rechaza email sin @', async () => {
    await expect(
      step1Schema.validateAt('email', { email: 'ashpokemon.com' })
    ).rejects.toThrow('válido');
  });

  it('rechaza email sin dominio', async () => {
    await expect(
      step1Schema.validateAt('email', { email: 'ash@' })
    ).rejects.toThrow('válido');
  });

  it('rechaza email con más de 100 caracteres', async () => {
    await expect(
      step1Schema.validateAt('email', {
        email: `${'a'.repeat(95)}@b.com`,
      })
    ).rejects.toThrow('100 caracteres');
  });
});

// ---------------------------------------------------------------------------
// Step 2 Schema
// ---------------------------------------------------------------------------

describe('step2Schema — district', () => {
  const validDistricts = ['Ate', 'Breña', 'Miraflores', 'Kanto', 'Johto'];

  validDistricts.forEach((district) => {
    it(`acepta distrito válido: ${district}`, async () => {
      await expect(
        step2Schema.validateAt('district', { district })
      ).resolves.toBe(district);
    });
  });

    it('rechaza distrito vacío', async () => {
    await expect(
        step2Schema.validateAt('district', { district: '' })
    ).rejects.toThrow('uno de:');
    });

  it('rechaza distrito no válido', async () => {
    await expect(
      step2Schema.validateAt('district', { district: 'Lima' })
    ).rejects.toThrow('uno de:');
  });
});

describe('step2Schema — favoritePokemonType', () => {
  const validTypes = ['Fuego', 'Agua', 'Planta'];

  validTypes.forEach((type) => {
    it(`acepta tipo válido: ${type}`, async () => {
      await expect(
        step2Schema.validateAt('favoritePokemonType', {
          favoritePokemonType: type,
        })
      ).resolves.toBe(type);
    });
  });

  it('rechaza tipo vacío', async () => {
  await expect(
    step2Schema.validateAt('favoritePokemonType', {
      favoritePokemonType: '',
    })
  ).rejects.toThrow('uno de:');
});

  it('rechaza tipo no válido', async () => {
    await expect(
      step2Schema.validateAt('favoritePokemonType', {
        favoritePokemonType: 'Eléctrico',
      })
    ).rejects.toThrow('uno de:');
  });
});

// ---------------------------------------------------------------------------
// Schema completo
// ---------------------------------------------------------------------------

describe('trainerSchema — validación completa', () => {
  const validData = {
    fullName: 'Ash Ketchum',
    age: 10,
    email: 'ash@pokemon.com',
    district: 'Kanto',
    favoritePokemonType: 'Fuego',
  };

  it('valida datos completos correctos', async () => {
    await expect(trainerSchema.validate(validData)).resolves.toMatchObject(
      validData
    );
  });

  it('rechaza cuando falta fullName', async () => {
    const { fullName, ...withoutName } = validData;
    await expect(trainerSchema.validate(withoutName)).rejects.toThrow();
  });

  it('rechaza cuando age es menor a 10', async () => {
    await expect(
      trainerSchema.validate({ ...validData, age: 9 })
    ).rejects.toThrow('al menos 10 años');
  });

  it('rechaza cuando email es inválido', async () => {
    await expect(
      trainerSchema.validate({ ...validData, email: 'noesemail' })
    ).rejects.toThrow('válido');
  });

  it('rechaza cuando district no es válido', async () => {
    await expect(
      trainerSchema.validate({ ...validData, district: 'Hoenn' })
    ).rejects.toThrow('uno de:');
  });
});