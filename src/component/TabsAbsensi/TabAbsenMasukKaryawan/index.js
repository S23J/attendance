import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import React, { useMemo } from 'react'

function TabAbsenMasukKaryawan ( {
    absensiMasuk
} )
{

    const columns = useMemo(
        () => [

            {
                header: 'Tanggal',
                accessorFn: ( row ) => new Date( row.checkin_time ),
                filterVariant: 'date-range',
                Cell: ( { cell } ) => cell.getValue().toLocaleDateString(),
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
                size: 150,
            },
            {
                header: 'Jam',
                accessorFn: ( row ) => (
                    row.checkin_time.split( 'T' )[ 1 ].split( '.' )[ 0 ]
                ),
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
                size: 150,
            },
            {
                header: 'Telat',
                accessorKey: 'late_duration',
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
                size: 150,

            },

        ],
        [],
    );


    const table = useMantineReactTable( {
        columns,
        enableDensityToggle: false,
        initialState: { density: 'xs' },
        data: absensiMasuk,
        enableRowNumbers: true,
        rowNumberMode: 'static',
        enableGlobalFilter: false,
        enableColumnResizing: false,
        isMultiSortEvent: () => true,
        mantineTableProps: {
            striped: true,

        },
    } );

    return (
        <div>
            <MantineReactTable
                table={ table }
            />
        </div>
    )
}

export default TabAbsenMasukKaryawan
