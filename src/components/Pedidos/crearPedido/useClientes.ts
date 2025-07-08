import { useEffect, useState } from 'react';

export interface Cliente {
  _id: string;
  rif: string;
  email: string;
  encargado: string;
}

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    console.log('Consultando clientes en /clientes/');
    fetch('/clientes/')
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener clientes');
        return res.json();
      })
      .then(data => {
        setClientes(data);
        setLoading(false);
        console.log('Clientes recibidos:', data);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
        console.error('Error al obtener clientes:', err);
      });
  }, []);

  return { clientes, loading, error };
}
