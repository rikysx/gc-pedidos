-- Clientes de PRUEBA (clave 1234). Bórralos cuando cargues los reales:  delete from clientes;
insert into clientes (rut, nombre, clave_hash) values
('11111111', 'Óptica Vista Clara', 's1$b1a1c810cf540f1643adc775955a2b33$7a767e7e720e6ee0611a5f490a4ad6203606ce0d533a66d0d60c4a154cc06347'),
('12345678', 'Óptica Central Ltda.', 's1$b1a1c810cf540f1643adc775955a2b33$7a767e7e720e6ee0611a5f490a4ad6203606ce0d533a66d0d60c4a154cc06347'),
('76543210', 'Óptica Los Andes SpA', 's1$b1a1c810cf540f1643adc775955a2b33$7a767e7e720e6ee0611a5f490a4ad6203606ce0d533a66d0d60c4a154cc06347')
on conflict (rut) do nothing;
